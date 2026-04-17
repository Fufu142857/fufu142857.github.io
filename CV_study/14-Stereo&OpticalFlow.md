### Stereo & Optical Flow

#### 一、 Stereo Vision (双目立体视觉) 基础
Stereo 的核心目标是通过两台内外参已知 (Calibrated) 的相机拍摄的左右两张图像，通过寻找像素匹配来恢复场景的 **Depth (深度)** 。

* **Rectification (极线校正)**:
  * **原理**: 任意摆放的两台相机会导致特征匹配需要在倾斜的极线 (Epipolar line) 上搜索。为了简化问题，我们通过计算一个 **Homography (单应性矩阵)** ，将两张图像进行虚拟的旋转 (Warping)，使得两台相机的视线完全平行。
  * **优势**: 校正后，所有对应的极线都会变成水平的 Scanline (扫描线)。此时，左图中的像素在右图中必定具有相同的 Y 坐标，特征匹配从复杂的 2D 搜索或斜线搜索降维成了纯粹的水平 1D 搜索。

* **Disparity (视差, $d$)**:
  * **定义**: 同一个三维点在左右两张校正图像中 X 坐标的差值，即 $d = x_2 - x_1$。
  * **与深度的关系**: 根据相似三角形原理，可以推导出 $d = \frac{B \cdot f}{Z}$（其中 $B$ 是基线 Baseline，$f$ 是焦距，$Z$ 是深度）。视差与深度成**反比** :就像坐在火车上，近处的树移动得快 (视差大)，远处的山几乎不动 (视差小)。

#### 二、 Stereo Matching (立体匹配算法)
求解视差的核心在于寻找 **Correspondence (对应点)** 。根据优化策略，主要分为局部方法和全局方法。

**1. Local Methods (局部方法)**

* **基本思路**: 在右图水平线上寻找一个让颜色/亮度差异最小的对应点。为了避免无纹理区域 (Textureless region) 导致的匹配歧义，通常采用一个 **Local window (局部窗口)** ，假设窗口内所有像素具有相同的深度，并计算整个窗口的匹配代价 (如 SSD 或 ZNCC)。
* **Cost Volume / DSI (视差空间图像)**: 对于每一个像素 $(x,y)$，遍历所有可能的视差 $d$ 计算代价，形成一个三维的数据体 (Cost Volume)。
* **Cost Aggregation (代价聚合)**: 使用局部窗口匹配，本质上等价于先在 DSI 上计算单像素代价，然后用一个 **Box filter (盒式滤波)** 进行平滑。但 Box filter 会导致物体边缘处的深度变得模糊 (由于窗口跨越了前景和背景)。
在window里计算 $SSD$
  + want window large enough to have sufficient intensity variation 
  + want window small enough to contain only pixels with same depth

* **Edge-preserving Filters**: 为了在平滑噪声的同时保护边缘，现代局部方法往往使用 **Bilateral filter (双边滤波)** 或极速的 **Guided filter (导向滤波)** 对 DSI 进行代价聚合，最后通过 **Winner-take-all (赢者通吃)** 策略选出代价最小的视差。

**2. Global Methods (全局方法)**
* **基本思路**: 摒弃局部窗口，将视差估计建模为一个全局能量最小化问题：$E(d) = E_{data}(d) + \lambda E_{smooth}(d)$。
* **能量项**:
  * **Data term (数据项)**: 衡量像素匹配的相似度。
  * **Smoothness term (平滑项)**: 惩罚相邻像素之间出现不同的视差。惩罚力度与相邻像素的颜色差异成反比（颜色越相近，越应该具有相同视差）。
* **优化算法**: 可以通过 **Graph Cuts (图割，如 $\alpha$-expansion)** 或 **Belief Propagation (置信度传播)** 来求解这个多标签的非线性优化问题，通常能获得极强的局部最优解。

**3. Dynamic Programming & SGM (动态规划与半全局匹配)**
* **Dynamic Programming (DP)**: 如果为了提速，每次只针对图像的“单独一行”进行全局优化，就可以利用 DP 找到数学上的全局最优解。但由于忽略了行与行之间的垂直平滑约束，结果会产生明显的水平条纹瑕疵 (Streaking artifacts)。
* **Semi-Global Matching (SGM)**: 为了兼顾速度与全图平滑，SGM 算法沿着 8 或 16 个不同的方向独立运行一维的 DP 聚合代价，最后将所有方向的代价累加并执行 Winner-take-all。这种方法极大超越了纯局部方法，且比图割算法快几十倍，是工程界最主流的算法之一。

#### 三、 Optical Flow (光流基础)
光流用于在连续的视频帧中估计每个像素的二维运动向量 $(u, v)$。光流不再具备极线几何的约束，需处理动态场景中的任意运动。

* **核心假设**:
  * **Brightness Constancy (亮度恒常性)**: 同一个点在运动前后像素值保持不变。
  * **Small Motion (微小运动)**: 运动幅度足够小，以便进行数学上的 Taylor 展开。
* **Optical Flow Equation (光流基本方程)**:
  * 通过对亮度恒常性等式进行一阶 Taylor 展开，消去高次项后得到：$I_x u + I_y v + I_t = 0$（其中 $I_x, I_y$ 为图像空间梯度，$I_t$ 为时间差分梯度）。
* **Aperture Problem (孔径问题)**:
  * 上述方程是一个二元一次方程（一条直线），却有两个未知数 $(u, v)$，这是一个欠定问题 (Under-determined)。
  * 物理意义：当我们透过一个小孔观察一条移动的边缘时，我们只能感知到垂直于边缘方向的运动 (**Normal flow**)，而无法感知平行于边缘方向的滑动。只有在拥有双向梯度的 **Corner (角点)** 处，才能确切感知真实的运动。
* **Lucas-Kanade (LK) 算法**: 
  * 一种**局部方法** 。假设一个小局部窗口（如 5x5）内所有像素具有相同的运动向量 $(u,v)$，从而获得 25 个方程，利用最小二乘法求解 $A^TA \begin{bmatrix} u \\ v \end{bmatrix} = A^T b$。
  * 神奇的联系：这里的矩阵 $A^TA$ 恰好就是我们之前学过的 **Harris Corner (哈里斯角点)** 的结构矩阵。只有在角点处，该矩阵才可逆，LK 光流才能成功求解。
* **Horn-Schunck (HS) 算法**:
  * 一种**全局方法** 。与 Stereo 的全局法极其相似，引入全局平滑约束，最小化能量泛函 $\iint (I_x u + I_y v + I_t)^2 + \lambda (|\nabla u|^2 + |\nabla v|^2) dx dy$。通过求解欧拉-拉格朗日方程或建立庞大的稀疏线性方程组进行迭代求解。

#### 四、 Modern Techniques for Optical Flow (现代光流高级技术)
为了解决大尺度运动和复杂环境干扰，现代光流算法引入了以下核心技术：

* **Warping / Coarse-to-fine (图像变形与多分辨率)**: 
  * **动机**: 当运动超过 1 个像素时，泰勒展开失效。
  * **解法**: 构建 **Image Pyramid (图像金字塔)** 。先在极低分辨率下（运动被缩小到 1-2 像素）安全地求解出光流。然后将光流放大 (Upsample 并乘以 2)，用该光流对下一层的目标图像进行 **Warping (变形/扭曲)** 。Warping 后的图像与原图之间的残差运动极其微小，可以安全地继续应用光流方程迭代优化。
* **Gradient Constancy (梯度恒常性)**:
  * 相机自动曝光或白平衡变化会导致亮度恒常性假设破产。除了要求颜色一致，强制要求图像在两个时刻的**空间梯度向量 (Gradient)** 保持一致，这能极大增强对光照变化的鲁棒性。
* **Robust Cost Function (鲁棒代价函数)**:
  * 传统的 HS 算法为了方便求导使用了误差的平方项 (L2 norm)，但这会被遮挡或边缘处的巨大误差拉偏模型。现代算法通常将惩罚函数替换为 **M-estimator (如 L1 绝对值损失)** ，以提高系统对离群值 (Outliers) 的抗干扰能力。
* **Median / Bilateral Filter (中值/双边滤波)**:
  * 被戏称为现代光流算法的 "Top secret"。在每次金字塔层级解出光流后，立即对光流场施加一次中值滤波或双边滤波。这相当于在原本的能量函数中巧妙地注入了一个极其强力的保边平滑先验，能极其有效地剔除错误匹配的飞点。

#### 五、 KLT Tracker (目标追踪器)
KLT 追踪器不单单追踪一个像素，而是追踪一小块包含物体的图像 Patch，并允许该目标发生参数化的形变。

* **Warping Model (变形模型)**: 可以是 Translation (平移，退化为 LK 光流)、Affine (仿射，允许旋转拉伸) 等。
* **优化过程**: 
  * 目标是找到最优的变形参数 $p$，使形变后的图像与目标模板误差最小。
  * 已知上一帧的粗略位置，求解参数的增量 $\Delta p$。通过对非线性误差函数进行 Taylor 展开，会涉及计算图像的空间梯度，以及 **Jacobian matrix (变形函数对参数的雅可比矩阵)** 。
  * 最终转化为求解一个线性系统（求偏导等于0）。这是一个不断利用当前参数进行 Warp $\rightarrow$ 算残差 $\rightarrow$ 算雅可比矩阵 $\rightarrow$ 更新 $\Delta p$ 的迭代收敛过程。
