### Homography

#### 1 Planar Motion Models

* **应用动机**: 在制作 **Panorama (全景图)** 时，如果只是将多张照片简单地进行 **Translation (平移)** 或叠加，图像在接缝处（如栏杆、屋顶）会出现明显的断裂和错位。为了将不同视角的图像完美地 Register (配准) 和拼接，我们需要更高级的平面线性变换模型。

* **平面变换的层级**

    * **Translation & Rotation (平移与旋转)**: 形状不发生任何改变。
    * **Similarity (相似变换)**: 在平移和旋转的基础上加入 **Scale (尺度缩放)** ，形状依然保持。
    * **Affine (仿射变换)**: 允许在斜方向上发生拉伸 (Shear)，正方形会变成平行四边形。它的重要特性是**平行的线变换后依然平行**。在矩阵表示中，最底下一行必定是 `0 0 1`。
      - can be 组合 by other more basic opperations
    * **Projective / Homography (透视变换 / 单应性)**: 最通用的平面变换。它会丢失平行性（例如铁轨在图像中会相交），长度比例也会改变，但它仍能保持“直线依然是直线”的特性。矩阵表示里最底下一行 `g h 1` 不一定是 `0 0 1`.

#### 2 Homogeneous Coordinates & `H` Matrix

* **引入齐次坐标**: 传统的 2D 欧氏坐标 $(x, y)$ 无法用一个简单的 2x2 矩阵乘法来表示平移操作。通过引入 **Homogeneous Coordinate (齐次坐标)** ，我们在末尾增加一个维度，将点表示为 3x1 的向量 $[x, y, 1]^T$。这样，平移以及复杂的 Homography 变换都可以统一用 3x3 矩阵的乘法来表示。

* **坐标转换**: 如果要把齐次坐标变回图像平面的欧氏坐标，只需将前两个元素除以第三个元素 $\omega$ (即进行 Normalization)。

* **Define up to a scale (尺度等价)**: **Homography** 是一个任意的 3x3 矩阵 $H$。由于齐次坐标在转回普通坐标时需要除以最后一个元素，所以矩阵 $H$ 整体乘以任何非零常数，最终表示的变换是完全一样的。因此，虽然 $H$ 有 9 个元素，但它只有 **8 个自由度 (Degrees of Freedom, DoF)** 。

#### 3 Solve Homography Matrix
> DLT Algorithm

* **数学约束**: 假设我们有一对 **Feature correspondence (特征匹配点)** $x$ 和 $x'$，它们满足 $x' = Hx$（这里的等于代表相差一个常数倍数，即共线）。这在代数上等价于它们的 **Cross product (叉乘)** 为零，即 $x' \times Hx = 0$。

* **线性方程组**: 每一对匹配点可以通过叉乘展开，提供 2 个线性独立的方程。因为 $H$ 有 8 个未知数，所以我们**至少需要 4 对特征点 (4 pairs of points)** 才能求解出 $H$。

* **SVD 求解**: 将 4 对（或更多对）点的约束堆叠起来，可以构建一个线性方程组 $AH = 0$。为了避免求出全 0 的无意义解(trivial solution)，我们需要施加约束（通常是要求 $H$ 向量的长度 $\|H\|=1$）。这本质上变成了一个受约束的最优化问题，其标准解法是对矩阵 $A$ 进行 **SVD (Singular Value Decomposition, 奇异值分解)** ，分解得到 $A = UDV^T$，而我们要找的解 $H$ 就是矩阵 $V$ 的最后一列 (Last column)。

---

#### Overall Pipeline
+ 3D rotation $\to$ homography image transformation
+ Use feature correspondence
+ Solve the homography model
+ Warp all images to a reference one
+ Use your favorite blending

---

#### 4 Geometric premise of Panorama

使用 Homography 进行无缝图像拼接是有严格几何物理前提的，主要分为两种情况：

1.  **Pure Rotation (纯旋转)**: 相机的投影中心 (Camera center) 绝对不能有平移，只能在原地旋转。如果相机发生平移，远近不同的物体会产生视差，导致投影平面上出现重影 (Ghosting)，Homography 模型就会失效。
> Panorama is hard to get when close-up graph

2.  **Planar Scene (纯平面场景)**: 唯一的例外是当目标场景本身就是一个绝对的平面（例如一面平整的墙壁或海报）时，即使相机中心发生了移动，也依然可以用 Homography 将不同视角的图像完美配准。

#### 5 Robust Model Fitting

特征匹配 (Feature matching) 绝不可能是完美的，一定混杂着错误的匹配点，即 **Outliers (离群值)** 。哪怕只有一个极端的 Outlier，传统的 **Least Squares (最小二乘法)** 也会因为其使用平方项 ($x^2$) 作为误差惩罚，导致拟合出的模型发生灾难性的偏离。

> 为此需要引入两种核心工具来提升算法的鲁棒性.
* **M-estimator**: 不再使用平方项作为误差惩罚函数 (Penalty function)，而是换成一种增长极其缓慢的函数（如绝对值 Huber loss，或带上限的阈值函数）。这能有效限制外点对优化的巨大拉扯力，降低 Outliers 带来的伤害。

* ==**RANSAC (Random Sample Consensus)**: 这是解决 Outlier 的终极杀器==
    * **核心思想**: 既然数据里有坏点，就不要一上来用所有点拟合。相反，每次**随机挑选最少数量的样本 (Random sampling)** (例如拟合直线挑 2 个点，拟合 Homography 挑 4 个点) 来计算一个基础模型。
    * **Inlier Counting**: 用这个基础模型去测试剩余所有的点，统计有多少个点与该模型吻合（误差小于阈值），这些吻合的点称为 **Inliers (局内点)** 。
    * **迭代最优**: 重复这个随机采样过程 $N$ 次，找出获得 Inliers 投票数最多的那个模型，并提取出它的 Inliers 集合。最后，只用这群干净的 Inliers 集合，再做一次整体的模型拟合 (通常结合 M-estimator)，得到最终结果。
*听上去是valid set*
    * **迭代次数 $N$ 的计算**: $N$ 可由公式 $N = \frac{\log(1-P)}{\log(1-(1-e)^S)}$ 决定（$P$ 是期望成功的置信度如 99%，$S$ 是单次采样数量，$e$ 是 Outlier 的比例）。注意：如果 Outlier 比例超过 50%（坏人比好人多），RANSAC 极大概率会失效。

#### 6 Error / Distance Metrics
在优化和评估 Homography 时，通常涉及三种误差定义：
Cost Function
* **Algebraic distance (代数距离)**: 指求解 $AH = 0$ 时产生的交叉乘积残差 $\|AH\|$。它纯粹是为了将问题转化为易于计算的线性方程而构造的，缺乏实际的物理几何意义。

* **Geometric distance (几何距离)**: 将原图点 $x$ 通过 $H$ 映射到第二张图后 ($Hx$)，与真实匹配点 $x'$ 之间在二维图像平面上的 **Euclidean distance (欧氏距离)** 。也可以将双向映射的误差相加形成对称的几何误差。

* **Reprojection error (重投影误差)**: 三维视觉中的**黄金标准 (Golden standard)**
它假设两张图像上检测到的特征点都有高斯噪声。算法致力于寻找一个完美符合数学模型 ($H\hat{x} = \hat{x}'$) 的真实二维坐标 $\hat{x}$ 和 $\hat{x}'$，并使得这些完美坐标到实际检测坐标的欧氏距离之和达到最小。
