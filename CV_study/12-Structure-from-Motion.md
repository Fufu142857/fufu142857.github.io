### Structure-from-Motion (SfM)

#### 1 Introduction

* **什么是 SfM**: Structure-from-Motion 旨在从一组由运动相机拍摄的图像（或视频序列）中，同时恢复出场景的三维结构以及相机的运动轨迹。

* **输入 (Input)**: 提取并匹配好的 **Feature correspondence (特征点对应关系)** 。即同一个三维点在多张不同图像上的二维投影坐标。
$p_{ij} = (u_{ij}, v_{ij})$
第 $i$ 个三维点在第 $j$ 张图上的投影坐标。

* **输出 (Output)**: 
  * **Structure (结构)**: 场景的 **3D Point Cloud (三维点云)** 坐标 $X_i$
  * **Motion (运动)**: 每个相机在三维空间中的 **Camera pose (相机姿态)** ，包括位置中心 (Location/Translation) 和朝向 (Orientation/Rotation)，有时还包括相机的内参 (Intrinsic parameters) $t_j, R_j, K_j$

#### 2 Bundle Adjustment
为了从输入得到输出，SfM 将其转化为一个非线性的能量最小化数学问题，这个核心优化过程被称为 **Bundle Adjustment (BA)** 。

* **Reprojection Error (重投影误差)**: BA 的优化目标。它衡量的是：将算法猜测的三维点，利用猜测的相机姿态重新投影到二维图像上（即 Model prediction），这个投影点与实际检测到的特征点（即 Observation）之间的欧氏距离的平方和。

* **为什么叫 Bundle**: 指的是穿过同一个三维点的多条光线 (Bundle of lines)。调整相机和点的位置让这些光束完美相交，就是 Bundle Adjustment。

* **非线性最小二乘问题 (Non-linear Least Squares)**: 因为相机投影模型中包含除以深度 $Z$ 的非线性操作，所以 BA 是一个极其复杂的高维非线性优化问题，要求极其接近 **Global minimum (全局最优解)** 

$e_{ij}$

* **优化算法**:
  * **Gauss-Newton (高斯-牛顿法)**: 利用 Taylor expansion (泰勒展开) 将非线性误差函数局部线性化，通过构建并求解线性方程组 $H \Delta = -B$ 来计算参数的更新量 ($\Delta$)。
  1. compute the terms of linear systems
  2. sove it by $H\Delta = - b$
  3. update previous result by $P \leftarrow P + \Delta$

  * **Levenberg-Marquardt (LM 算法)**: BA 中最常用的算法。它在 Gauss-Newton 的 Hessian 矩阵对角线上加入了一个动态调节的阻尼因子 (Damping factor $\lambda$)。当优化顺利时，它接近快速收敛的 Gauss-Newton；当优化偏离时，它接近保证收敛的 **Gradient descent (梯度下降)** ，从而兼顾了两者的优点。

* **利用稀疏性加速 (Sparsity & Schur Complement)**:
  * 在计算雅可比矩阵 (Jacobian Matrix, $J$) 和海森矩阵 (Hessian Matrix, $H$) 时，由于一个特征点的投影误差只与其对应的 3D 坐标和相机参数有关，与其他点和相机无关，因此 $J$ 和 $H$ 是极其 **Sparse (稀疏)** 的。
  * 利用这种稀疏的分块结构，可以使用 **Schur complement (舒尔补)** 技巧，将原本巨大的求逆矩阵降维，极大提升了 BA 的计算速度。

#### 3 Rotation Parameterization
在 BA 优化中，如何用变量来表示相机的旋转极其关键。相机的旋转只有 3 个 **Degrees of freedom (自由度)** 。

* **3x3 Matrix (直接用九个变量)**: 极不可取。优化算法没有正交约束概念，算出的矩阵会违背旋转矩阵的数学性质 ($R^TR = I$)。
* **Euler Angles (欧拉角)**: 用三个角度表示。致命缺点是会产生 **Gimbal lock (万向节死锁)** 现象，导致参数空间发生退化 (Degeneration)，让优化陷入极其复杂的地形中。
* **Axis-angle (轴角)**: 用旋转轴向量和旋转角度表示。缺点是旋转具有周期性（360度绕回），会导致能量函数呈非凸的复杂形状。
* **Quaternion (四元数)**: 极其常用。它用一个 4 维的超复数来表示旋转，数学性质好，但必须保证其是一个 **Unit quaternion (单位四元数，即模长为1)** 。这相当于引入了一个约束，需要在优化中特别处理或后续归一化。

#### 4 Initializing BA and Framework of SFM
因为 BA 是非线性优化，极其依赖一个优秀的 **Initialization (初值)** ，否则可能收敛到错误的局部最优。根据生成初值的方式，SfM 算法分为两大流派：

**1. Incremental SfM (增量式 SfM)**
最经典的做法，通过一张张添加图片来逐步构建模型。
* **流程**: 挑选初始的一对图像 $\rightarrow$ 计算 Essential matrix $\rightarrow$ 分解姿态并 **Triangulation (三角化)** 出初始 3D 点 $\rightarrow$ 挑选下一张图像 $\rightarrow$ 利用 3D-2D 匹配点进行 **Resectioning (后方交会 / PnP)** 计算新相机姿态 $\rightarrow$ 循环继续。

* **致命缺陷 (Drift)**: 因为每次新添加的相机姿态都依赖于有误差的 3D 点，误差会逐级累积放大。必须频繁地调用耗时的 Bundle Adjustment 来消除累积误差。

* **缺点**: 运行效率 (Runtime efficiency) 极低，90% 的时间都在重复跑 BA；另外，这种逐步固定的优化在数学上往往不是全局最优 (Global optimum)；还需要依靠启发式规则 (Heuristics) 去寻找 Next best view。

**2. Global SfM (全局式 SfM)**
为解决增量式的缺陷，全局法试图一次性解出所有相机的位姿，最后只跑一次 BA。

* **Rotation Averaging (全局旋转平均)**: 先独立于相机位置，利用所有图像对之间相对的 Essential matrix 分解出的相对旋转，建立整体的线性或非线性方程组，一次性解出所有相机的绝对 **Orientation (朝向)** 。

* **Translation Averaging (全局平移平均)**: 有了全局旋转后，再求解相机的中心位置。

  * **核心挑战**: 仅靠 Essential matrix 分解出的相对平移方向 ($t_{ij}$)，**无法处理相机沿直线运动 (Collinear motion) 的情况** ，因为矩阵丢失了绝对的尺度 (Scale) 信息。
  * **解决方案**: 必须引入 3D 辅助点。通过观察同一个 3D 点在不同图像对中三角化出来的深度，可以计算出不同基线长度 (Baseline length) 的比例关系。利用这个尺度比例和旋转矩阵，可以在位姿图 (Pose Graph) 上的每个相机三角形中构建线性方程，最终通过 SVD 直接解出所有相机的全局中心点。
