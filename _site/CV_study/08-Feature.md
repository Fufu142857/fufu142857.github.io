### Feature Detector & Descriptor

#### 1 Introduction

- **Why Extract Feature**

  - **Local feature (局部特征)** 对物体遮挡 (Occlusion) 和背景杂乱 (Clutter) 具有很强的鲁棒性，因为只需看到局部就能进行匹配。
  - 一张图像可以提取出成百上千个特征点，这为后续计算几何模型（如需要 5 个或 8 个点来计算的矩阵）提供了丰富的数据基础。
  - **应用场景广泛**: 涵盖 Instance level object recognition (特定平面或三维物体识别)、Location recognition (地点识别)、Robot localization (机器人导航定位) 以及 Image stitching/Panorama (全景图拼接) 等。

- **Steps** 
> 本质上分为两大步

  1. **Feature Detection (特征检测)**: 在图像中找到足够独特的点 (Good Unique point), be distinctive.
  2. **Feature Description (特征描述)**: 将提取出的局部信息转化为特征向量，以便在不同图像之间进行准确的 Matching (匹配)。

- **Feature Matching Problem's 核心挑战 - Invariance (不变性)**: 我们希望当图像发生 Rotation (旋转)、Scale (尺度缩放)、Intensity/Illumination (光照明暗) 或 Viewpoint (视角) 变化时，算法依然能稳定地 Detect 到同一个点，并产出相似的 Descriptor。

#### 2 Feature Detector

提取特征的核心思想是找一个足够 Unique (独特) 的局部窗口 (Local window)，即无论向哪个方向移动该窗口，窗口内的像素分布 (Intensity pattern) 都会发生剧烈变化。

**1. Harris Corner Detector (哈里斯角点检测)**

- **数学建模**: 定义一个位移向量 $(u, v)$，计算窗口移动前后像素的差异，即 **SSD (Sum of Squared Differences)** 。通过对图像函数进行 Taylor expansion (泰勒展开)，SSD 可以近似表示为一个二次型：$[u, v] M [u, v]^T$。

- **结构矩阵 $M$**: 矩阵 $M$ 包含了图像在 X 和 Y 方向的 Gradient (梯度) 的平方和乘积。矩阵 $M$ 决定了 SSD 的能量增长形态（可视为一个椭圆等高线）。

- **Eigenvalues (特征值) 分析**:

  - 如果 $M$ 的两个特征值 $\lambda_1, \lambda_2$ 都很小，说明是 Flat region (平坦区域)。
  - 如果一个大一个小，说明是 Edge (边缘)，沿着边缘移动能量不怎么变化。
  - **只有当两个特征值都很大时，才是一个 Corner (角点)** , 方向能量增长很大。
  - 需要 $\lambda_{min}$ 足够大

- **Response Function (响应函数)**: 为了避免求解复杂的特征值，直接使用矩阵的 Determinant (行列式) 和 Trace (迹) 来计算角点响应值 $f = \det(M) - \alpha \cdot \operatorname{trace}(M)^2$。

- **Non-maximum Suppression (非极大值抑制)**: 找出的角点通常是一个区域，需要在局部邻域内寻找 Local maximum (局部极大值)，把其他非极大值点剔除，以获得单像素宽的唯一特征点。

- **不变性评估**: Harris Corner 具有 Rotation invariance (旋转不变性) 和一定程度的 Intensity shift 不变性，但 **完全不具备 Scale invariance (尺度不变性)** 。如果图像被放大，原来的角点可能会被当成平滑的边缘。

**2. Scale Selection & DoG (尺度选择)**

- **Automatic Scale Selection (自动尺度选择)**: 为了解决尺度变化问题，我们需要让算法自动确定特征点所在的最佳尺度。基本思路是用不同尺寸的 Local window 去计算响应值，寻找响应值最大的那个尺度。
> rescale to fixed size

- **Image Pyramid (图像金字塔)**: 实际工程中，为了加速计算，通常会构建 Image pyramid (将图像不断下采样缩小)。在金字塔的每一层上使用固定大小的窗口进行扫描。

- **DoG (Difference of Gaussians)**: 计算特征响应时，使用 Laplacian of Gaussian (LoG) 效果很好。为了进一步加速，常使用两个具有不同 $\sigma$ 值的 Gaussian filter 相减来近似 LoG，这就是 DoG。可以替代 Response f.

- **3D Local Extrema**: 将带有尺度的图像视为一个 3D volume (X, Y, Scale 三个维度)。算法不仅要在平面上寻找极值，还要在相邻的尺度层之间比较，寻找三维空间中的 Local maximum / minimum。找到的点即为带有特定 Scale 信息的特征点。

**3. FAST Corner Detector**

- **极速检测**: 不再计算梯度或展开矩阵，而是直接检查中心像素周围一个圆周（例如16个像素）的亮度。
- 如果在圆周上有连续的 N 个像素（如12个）都比中心点亮或都比中心点暗（超过某个 Threshold），则认为这是一个 Corner。
- 结合 Decision tree (决策树) 进行快速排除和判断，计算速度极快。

#### 3 Feature Descriptor

有了带有 Scale 和中心坐标的特征点后，需要用向量来描述它，以便做 Matching。
描述子的设计需要在“不变性 (Invariance)”和“区分度 (Discriminative power)”之间寻找平衡。

**1. SIFT Descriptor** SIFT (Scale-Invariant Feature Transform) 是非常经典且极其成功的描述子，可容忍一定的 3D Rotation 和光照变化。

- **基础优化**: 直接使用 raw pixel 值对光照太敏感，因此改用 Gradient (梯度)。直接使用梯度向量对轻微的几何形变太敏感，因此改用 Histogram (直方图) 统计。
$\to$ Spatial Histograms
- **Rotation Invariance**: 统计局部窗口内的梯度方向直方图，找到得票数最高的 Dominant orientation (主方向)。然后将窗口旋转，使其主方向与 X 轴对齐，从而实现旋转不变性。

- **特征构建**:
  - 以特征点为中心，取一个 16x16 的局部 Patch。
  (0-360degrees)
  - 将其划分为 4x4 个 Cell (网格)。
  - 在每个 Cell 内部，计算 8 个方向 (8-bin) 的梯度方向直方图。
  - 最终拼接成 $4 \times 4 \times 8 = 128$ 维的特征向量。

**2. 快速描述子: SURF, BRIEF, ORB**

- **SURF**: SIFT 的加速版。用 Haar wavelets (小波变换) 替代复杂的梯度计算，并利用 **Integral image (积分图)** 极大地加速了局部矩形区域内的求和操作。最终输出通常为 64 维向量。
- **BRIEF**: 一种 Binary descriptor (二进制描述子)。在特征点周围随机挑选多对像素 $(x, y)$ 比较亮度。若 $x < y$ 则记为 1，否则记为 0。进行 256 或 512 次比较后得到一串二进制编码。由于匹配时可直接利用 CPU 指令集计算 Hamming distance (海明距离)，速度极其快。
- **ORB (Oriented FAST and Rotated BRIEF)**: 结合了 FAST 检测器的速度和 BRIEF 的匹配速度，并额外计算了主方向对 BRIEF 采样点进行旋转，弥补了原版 BRIEF 没有旋转不变性的缺陷。

**3. 全局/区域描述子 (用于分类和检索)**

- **GIST**: 用于整张图像的 Holistic feature (全局特征)。通过一系列不同尺度、不同方向的 Gabor filters (滤波组) 与图像卷积，在 4x4 的网格内求平均，常用于快速的场景识别或 Image search。
- **HOG (Histogram of Oriented Gradients)**: 常配合 Sliding window (滑动窗口) 用于 Pedestrian detection (行人检测)。机制与 SIFT 类似，但统计范围是 Cell 组成 Block，并且在 Block 级别做 L2 Normalization (归一化)，不计算主方向。

#### 4 Feature Matching 

- **Distance Function**: 常用 L2 distance 计算 SIFT/SURF 的距离；用 Hamming distance 计算二进制描述子的距离。

- **Ratio Test**: 在含有 Repetitive structure (重复结构，如大楼相似的窗户) 的场景中，只看最近距离容易产生歧义误匹配。经典做法是寻找 Nearest match (最近匹配 $d_1$) 和 Second nearest match (次近匹配 $d_2$)。只有当 $d_1 / d_2 < \text{Threshold}$ (通常设为 0.7 左右) 时，才认为这是一个真实可靠的 Match，这有效保证了特征匹配的 Unique 性。

- **Evaluation (评估指标)**: 匹配过程本质上是一个 Binary classifier。可以通过调节 Threshold(tight or lossen) 来权衡 True positive (尽量多) 和 False positive (尽量少)。
  - 常用的评估曲线包括 ROC 曲线，或者看 Precision (准确率) 和 Recall (召回率)。
