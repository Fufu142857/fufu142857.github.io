### Ray Tracing 3 (Light Transport & Global Illumination)

#### 一、 辐射度量学核心概念深入 (Radiometry Review)
为了精确描述光线在空间中的传播规律，我们必须深刻理解并区分辐射度量学中的几个核心物理量。

**1. Irradiance (辐照度)**
*   **定义**：单位投影面积上接收到的辐射功率（Power per projected unit area）。
*   **物理意义**：它描述的是某一微小表面区域（如一个像素对应的真实表面）接收到了多少能量。因为只计算垂直于光线方向的有效投影面积，所以当光线倾斜照射表面时，接收到的能量会依照兰伯特余弦定律（Lambert's Cosine Law）乘上一个 $\cos\theta$ 的衰减系数。
*   **光照衰减的正确解释**：点光源在空间中传播时的能量衰减（$1/r^2$），本质上是 **Irradiance** 在衰减，而不是 Intensity（辐射强度）衰减。

**2. Radiance (辐射度 / 亮度)**
*   **定义**：单位立体角、单位投影面积上的辐射功率（Power per unit solid angle per projected unit area）。
*   **物理意义**：它是与**单根光线 (Ray)** 直接绑定的物理量。它描述的是某一微小表面，在某一个特定的方向上，发射、反射或接收到的光线能量。
*   **联系与区别**：
    *   **Radiance** 可以被理解为具有方向性的 **Irradiance**（即 Irradiance per solid angle）。
    *   **Irradiance** 是该点在所有方向上接收到的 **Radiance** 的总和（积分）。

#### 二、 双向反射分布函数 (BRDF)
理解了 Radiance，我们就可以精确定义材质是如何对光线进行反射的。

*   **反光机制的理解**：光线反射可以被分解为一个两步过程：首先，表面接收从某个入射方向进来的能量（Irradiance）；然后，表面将这些能量重新分配，向不同的出射方向辐射出去（转化为出射的 Radiance）。
*   **BRDF 的定义**：双向反射分布函数（Bidirectional Reflectance Distribution Function, BRDF）定义了**从某一特定方向入射的能量，会被分配多少比例到某一特定的出射方向上**。
*   **数学表达式**：$f_r(\omega_i \to \omega_r) = \frac{dL_r(\omega_r)}{dE_i(\omega_i)}$。它等于微小出射 Radiance 除以微小入射 Irradiance。
*   **物理作用**：BRDF 完全决定了物体的**材质 (Material)**。例如，镜面材质的 BRDF 会将所有能量集中在反射角方向；而漫反射（Diffuse）材质的 BRDF 会将能量均匀分布到所有出射方向上。

#### 三、 反射方程与渲染方程 (The Rendering Equation)
基于 BRDF，我们终于可以用数学公式严谨地表达光线在场景中的交互。

**1. 反射方程 (The Reflection Equation)**
*   要计算出着色点向相机（观察方向 $\omega_r$）辐射出的总能量，我们需要考虑该点接收到的所有入射光。
*   **计算方法**：遍历半球面上所有可能的入射方向 $\omega_i$，将每个方向传入的 Radiance 乘上该点的 BRDF（决定反射比例）以及 $\cos\theta_i$（几何投影夹角），然后将其**积分（求和）**起来。
*   这完美地解决了面光源以及多光源同时照亮一个点时的颜色计算问题。

**2. 渲染方程 (The Rendering Equation)**
*   反射方程有一个遗漏：如果物体本身就是光源（能够自己发光），我们需要将自发光的能量也加进去。
*   **公式定义**：$L_o(p, \omega_o) = L_e(p, \omega_o) + \int_{\Omega^+} L_i(p, \omega_i) f_r(p, \omega_i, \omega_o) (n \cdot \omega_i) d\omega_i$。
    *   $L_o$：向观察方向输出的总 Radiance。
    *   $L_e$：物体自身的发光项 (Emission)。
    *   积分部分：反射自其他光源或物体的能量。
*   （注：公式中的方向向量统一约定为从交点向外指，因此 $n \cdot \omega_i$ 等价于 $\cos\theta_i$）。

#### 四、 全局光照与光线传输算子 (Global Illumination & Light Transport)
渲染方程在数学上是一个带有递归性质的第二类弗雷德霍姆积分方程（Fredholm Integral Equation of second kind）。因为某个点的入射光 $L_i$，本质上是空间中另一个点的出射光 $L_o$。

为了更好地理解和求解，我们可以将复杂的积分方程抽象写为算子形式：
**$L = E + KL$**
*   $L$ 是我们要求的最终光照结果。
*   $E$ 是光源的直接发光项。
*   $K$ 是光线传输算子（Light Transport Operator），代表光线被物体反射（经历一次 BRDF 与积分作用）。

**泰勒展开与物理意义**
通过矩阵代数的移项与求逆，我们可以解得 $L = (I - K)^{-1} E$。利用类似泰勒级数（二项式定理）将其展开，可以得到极其优美且具有物理意义的等式：
**$L = E + KE + K^2E + K^3E + ...$**

*   **$E$ (0次弹射)**：直接看到光源本身（Emission）。
*   **$KE$ (1次弹射)**：直接光照（Direct Illumination）。光从光源出发，打在物体上反射一次进入眼睛。这正是光栅化着色主要处理的部分。
*   **$K^2E$ (2次弹射)**：间接光照（Indirect Illumination，如照镜子）。
*   **$K^nE$ (多次弹射)**：更多次的间接光照。
*   **全局光照 (Global Illumination, GI)** = 直接光照 + 所有次数的间接光照（即上述所有项的总和）。
*   随着光线弹射次数的增加，由于能量守恒与材质吸收（BRDF 衰减），画面会逐渐变亮但最终会收敛于一个真实的亮度，而不会无限制地过曝。

#### 五、 概率论基础复习 (Probability Review)
由于渲染方程的积分很难得出解析解，下节课我们将引入蒙特卡洛积分（Monte Carlo Integration）进行数值求解。为此需要先复习基础概率论概念：

*   **随机变量 (Random Variables, $X$)**：可以取各种可能结果的变量。
*   **概率分布**：离散情况下，所有概率非负且总和为 1（$\sum p_i = 1$）。例如掷骰子每一面的概率是 1/6。
*   **概率密度函数 (PDF, $p(x)$)**：在连续情况下，用来描述随机变量在某一点附近取值的概率密度。PDF 在整个定义域上的积分必须为 1（$\int p(x)dx = 1$）。
*   **期望 (Expected Value, $E[X]$)**：不断进行随机抽样所得到的平均值。
    *   离散型：$E[X] = \sum x_i p_i$。
    *   连续型：$E[X] = \int x p(x)dx$。
*   **随机变量的函数 (Function of a Random Variable)**：如果 $Y = f(X)$，那么对该函数求期望等于：$E[Y] = E[f(X)] = \int f(x) p(x)dx$。这一性质是蒙特卡洛方法解复杂渲染积分的核心数学基础。
