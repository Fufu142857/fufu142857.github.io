### Calibration & 2-View Geometry

#### 1 Camera Calibration
相机的标定旨在寻找相机参数，建立三维世界与二维图像之间的精确映射。主要包括以下几种典型场景与算法：

* **Resectioning (直接线性标定 / 空间后方交会)**:
  * **应用场景**: 当我们已知场景中物体的精确 3D 坐标，以及它们在图中的 2D 投影点时，直接把内外参作为一个整体的 Camera matrix (相机矩阵 $P$) 来求解。
  * **求解方法**: 利用 $x \times PX = 0$ (齐次坐标等价转化的叉乘) 来消除尺度因子，构建形如 $Ap = 0$ 的线性方程组。相机矩阵有 11 个 **Degrees of freedom (自由度)** ，每对 3D-2D 匹配点能提供 2 个方程，因此至少需要 6 个匹配点来求解。求解工具依然是 **SVD (奇异值分解)** 。
  > DLT Algorithm
  * **优化策略**: SVD 直接求解最小化的是无物理意义的 **Algebraic error (代数误差)** ，它会给远处的点赋予不合理的极高权重。因此，标准流程是先进行 **Data normalization (数据归一化)** 来提高数值计算稳定性，用 SVD 求得初始解后，再通过非线性优化来最小化 **Geometric error (几何误差)** 。
  > DLT 算出的解只是代数层面最优，而非物理层面最优。

---
### Summarize
**Gold Standard Algorithm for Camera Matrix P**

* **本质**: 求解 $3 \times 4$ 投影矩阵 $P$ 的最大似然估计 (MLE)。
* **输入**: $n \ge 6$ 对 3D-2D 匹配点。
* **三步标准流程**:
    1.  **线性初始化**:
        * **归一化**: 平移至质心并缩放尺度，消除数值不稳定性 ($\tilde{X}_i = U X_i$, $\tilde{x}_i = T x_i$)。
        * **DLT 求解**: 构造 $A\tilde{p} = 0$，用 SVD 求代数误差极小值。
    2.  **非线性优化 (核心)**: 将 DLT 的结果作为初值，迭代求解最小化**重投影误差 (Geometric Error / Reprojection Error)** ，获得物理意义上的最优解。
    3.  **反归一化**: 通过 $P = T^{-1} \tilde{P} U$ 还原出真实物理空间下的相机矩阵 $P$。

---

* **PnP (Perspective-n-Point)**:
  * **应用场景**: 当相机的 **Intrinsic parameters (内参)** 已知（如在视觉 SLAM 中），只需求解相机的 **Extrinsic parameters (外参)** （即相机在世界坐标系中的姿态 $R$ 和位置 $t$，共 6 个自由度）。
  * **P3P (最小解)**: 只需要 3 对匹配点。算法利用余弦定理建立关于点到相机中心深度的二次方程组。它会产生多达 4 个数学解，因此需要第 4 个点来验证出唯一正确的物理视角。
  > P3P Algorithm
  * **EPnP 等线性法**: 当特征点 $n \ge 5$ 时，可以忽略某些约束，将其转化为四次方程或使用 $O(n)$ 复杂度的先进算法（如 EPnP）直接求解。
  > Linear PnP Algorithm

* **Absolute Conic 与 Zhang's Calibration (张氏标定法)**

  * 内参未知，外参未知

  * **Circular points (圆环点)**: 在 2D 摄影几何中，所有的圆都会在无穷远直线上相交于两个特殊的虚数点，称为 Circular points。
  eg. $ 1 \\ i \\ 0$

  * **Absolute Conic (绝对二次曲线)**: 拓展到三维空间，所有不同朝向平面上的 Circular points 汇聚在无穷远平面上，形成了一个虚拟的椭圆，称为 Absolute Conic。
> 如果一个图里有3条相互垂直的线，那么就可以通过它求出内参

  * **与内参的关系**: 这个 Absolute Conic 投影到相机图像平面上的形状，我们称之为 **Image of the absolute conic (IAC)** ，它极度神奇地**完全由相机的内参 $K$ 决定** （表达式为 $K^{-T}K^{-1}$）。
  > 如果你知道 IAC， 给你两个pixels，是可以算出这两个点关于相机中心所张成的角度的cos

  * **张氏标定 (Checkerboard)**: 极其优雅的算法。利用棋盘格，我们可以轻易算出标定板到图像平面的 **Homography (单应性矩阵)** 。利用该 Homography，将标定板上的 2 个 Circular points 映射到图上。拍摄 3 张不同角度的棋盘格照片，就能凑齐 6 个点，从而拟合出 IAC（拟合圆锥曲线需 5 个点），进而通过矩阵分解直接获取内参矩阵 $K$。

#### 2 Two-View Geometry
当两台相机从不同视角观察同一三维场景时，会产生强烈的内在几何约束。
> 应用：在不知道目标物体真实尺寸的前提下，求解该物体在空间中的绝对三维坐标（特别是深度）

* **Epipolar Geometry (对极几何核心概念)**:
  * **Epipolar plane (对极平面)**: 空间点 $X$ 与两个相机的中心点共同定义了一个唯一的平面。
  * **Epipolar line (对极线)**: 对极平面与两个相机的图像平面相交得到的直线。图 1 中的像素点在图 2 中的匹配点，**必然而且只能**落在这条对极线上。这把特征匹配从 2D 全图搜索降维成了 1D 的线搜索。
  * **Epipole (对极点)**: 两个相机中心的连线 (Baseline) 与图像平面的交点。所有的对极线必然在图中相交于此对极点。不一定在拍出来的图片范围内。

* **Essential Matrix (本质矩阵, E)**:
  * 用于 **Calibrated camera (内参已知的相机)** 。
  * 它由两个相机的相对旋转 $R$ 和平移 $t$ 构成，公式为 $E = [t]_{\times} R$。因为平移无法确定绝对尺度，所以 $E$ 只有 5 个 **Degrees of freedom (自由度)** 。
  * 它的代数约束为：$q^T E p = 0$（其中 $p, q$ 为归一化后的三维视线向量）。

* **Fundamental Matrix (基本矩阵, F)**
  * 用于 **Uncalibrated camera (未标定相机)** , 内参未知。
  * 包含了外参和相机的内参，公式为 $F = K'^{-T} E K^{-1}$。它的代数约束形式同样为 $q^T F p = 0$（此时 $p, q$ 为直接的图像像素齐次坐标）。
  * $F$ 矩阵的一个极重要的性质是它的 **Rank (秩) 必须等于 2** 。这也意味着它有 7 个 Degrees of freedom (9 个元素 - 1 个尺度等价 - 1 个 Rank2 约束)。
  * 二维变成一维

#### 3 Estimating F and E

* **8-point Algorithm (八点算法)**:
  * 利用至少 8 对匹配点构成的 $Ax=0$ 线性方程组，使用 SVD 求解 F。
  * **Data normalization 是命脉**: 如果直接使用真实的像素坐标 (通常在上百或上千的量级)，方程高阶项的数值会达到数百万，导致矩阵极度病态退化。必须在求解前将坐标平移放缩至 $[-1, 1]$ 附近，否则算法必定失败。
  * **强制 Rank 2 (秩为 2)**: 带有噪声的数据求解出的 F 秩为 3。必须对求出的 F 再次进行 SVD 分解，将其最小的奇异值 (Singular value) 强制设为 0 以满足 Rank 2 约束。如果不这么做，图像上的所有对极线将无法精确相交于唯一的 Epipole。

* **7-point Algorithm (七点算法 - 最小解)**:
  * 利用 F 的 7 个自由度特性构建。用 7 对点 SVD 会得出解空间的两个基向量 $F_1, F_2$，真实的 $F = \alpha F_1 + (1-\alpha) F_2$。
  * 随后带入 $Det(F) = 0$ 的约束，求解一个一元三次方程获得 $\alpha$。此解法可能会得到 1 个或 3 个实数解。

* **Error Metrics (误差度量)**
  * **Algebraic error (代数误差)** $x'^T F x = 0$。缺乏物理意义，仅供快速求解初值。
  * **Geometric error (几何误差)** $x'$ 像素点到对应 Epipolar line ($Fx$) 的垂直欧氏距离。可以设计成对称的误差函数以抵御两张图中的特征点噪声。
  * **Reprojection error (重投影误差)**: **Golden standard (三维重建的黄金标准)** 。假定真实的 3D 空间点存在，使其理想投影点满足严苛约束，进而最小化理想投影点与实际检测像素点之间的差距。需要非线性优化手段求解。

* **Decomposing E (从 E 恢复外参)**
> Getting Camera Matrices from $E$
  * 对求得的 $E$ 进行 SVD 分解，可以剥离出两台相机之间的相对 $R$ 和 $t$。
  * 该数学分解会产生 4 组可能的解。我们可以利用 **Triangulation (三角化)** 将点投影出三维坐标。由于真实的物理点必须同时位于两台相机的“前方” (深度计算值为正)，以此进行深度测试 (Chirality check) 即可筛出唯一正确的相机姿态解。

#### 4 Triangulation 
已知两个相机矩阵 $P, P'$ 和图像上的特征匹配点 $x, x'$，求真实的三维点 $X$。

$$
x = PX 
x' = P'X
$$

* **Linear Method (线性法)**: 利用叉乘 $x \times PX = 0$ 消除未知深度建立线性方程组，并用 SVD 求解。速度快但误差并非基于物理意义。

* **Midpoint Algorithm (中点法)**: 一种更符合几何直觉的方法。由于存在噪声，空间中从两个相机的光心发出的两条光线几乎绝对不可能完美相交，而是成为**异面直线 (Skew lines)** 。算法寻找这两条视线的 **Mutual perpendicular line segment (公垂线)** ，然后取该公垂线的中点作为估算出的三维坐标点。
> 参数要注意放在同一个坐标系底下

* **非线性优化**: 用上述线性法或中点法获得三维点初值后，依然强烈建议通过 Levenberg-Marquardt 等迭代算法最小化 **Reprojection error** 来获得高精度结果。
