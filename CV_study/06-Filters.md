### Filters

#### 1. Image Filtering

- **核心思想**: 滤波的基本概念是用一个局部邻域内所有像素的 **Linear combination (线性组合 / 加权平均)** ，来替换掉中心像素的值。

- **Kernel (卷积核 / 滤波器)**: 决定如何进行加权平均的矩阵（例如 3x3 或 7x7 的窗口）。通常，我们会使用 **Spatially-invariant (空域不变)** 的滤波器，即同一个 Kernel 在整张图像的不同位置逐行滑动 (Scan) 并进行相同的计算。

- **边界处理 (Border Handling)**: 当 Kernel 滑动到图像边缘时，会超出边界。常见的处理方法包括 **Zero padding (补零)** ，或者直接复制边缘的真实像素值 (Copy value)。

- **基础滤波器类型**:

  - **Box filter (盒式滤波)**: 窗口内所有像素的权重相同，进行简单的平均。
  - **Gaussian filter (高斯滤波)**: 权重由中心向外呈高斯函数衰减，离中心越近权重越大。为了保持图像整体亮度不变，所有权重相加必须 **Normalize (归一化)** 为 1。相比 Box filter，高斯滤波在平滑图像的同时，对细节 (Detail) 的保留效果往往略有不同。
  - **Identity mapping & Translation**: 若 Kernel 中心为 1 其余为 0，图像不变；若右侧为 1 其余为 0，可实现图像整体向右平移。

- **巧用滤波 (Trick)**: 比如制作 PPT 里文字的 **Soft shadow (柔和阴影)** ，只需将文字图层做一个 Gaussian blur，然后向右下方平移一点叠在原图层之下即可。

#### 2. Edge Detection

提取图像的边缘和轮廓是经典的计算机视觉任务，其核心数学工具是 **Derivative (导数 / 梯度)** 。

- **离散求导与 Noise (噪声) 困境**: 图像的边缘本质上是像素值发生巨大“跳跃”的地方。对于离散的像素网格，我们可以用相邻像素做差分（如 1x3 的 filter）来近似求导。但真实图像充满 **Noise (噪声)** ，直接求导会导致微小的噪声也被放大为极高的梯度，使得真正的边缘被淹没。

- **Derivative of Gaussian (DoG)**: 安全的做法是先用高斯滤波 (Gaussian filter) 平滑掉噪声 (Smooth out noise)，然后再求导。在数学上，“先卷积再求导”等价于“先对 Kernel 求导再进行卷积”。因此，我们可以直接使用 **Derivative of Gaussian (DoG)** 滤波器一步到位，既平滑了噪声又提取了梯度。

- **Sobel Filter**: 经典实用的边缘检测算子。它是一个 3x3 的矩阵，本质上是结合了在一个方向上的 Blur 和在正交方向上的 Derivative。通过水平和垂直的 Sobel filter，我们可以分别计算出 X 方向和 Y 方向的梯度。

- **Gradient Amplitude (梯度幅值)**: 寻找边缘时，我们往往只关心边缘的强弱而不是具体方向。通过对 X 和 Y 梯度的平方和开根号，可以得到整体的 Amplitude。只要 Amplitude 够大，我们就认为这里有一条 Edge。

- **Non-maximum suppression (非极大值抑制)**: 滤波找出的边缘往往会有好几个像素宽。为了得到单像素宽 (Single pixel wide) 的精准边缘，我们会沿着边缘的法向去对比相邻像素：只有当该像素的 Amplitude 大于它两边的邻居时，才保留它 (即局部最大值)，否则将其剔除 (Suppress)。

#### 3. Edge-Preserving Filters - Bilateral Filter

- **Gaussian Blur 的缺陷**: 传统高斯滤波会无差别地混合邻域内的像素。如果在黑白分明的边缘处进行高斯滤波，黑白像素会被强行平均，导致本该锐利的边缘变成模糊的过渡带。我们希望只平均同类的像素（白跟白平滑，黑跟黑平滑）。

- **Bilateral Filter 的原理**: 它属于 **Spatially-variant (空域可变)** 的滤波器，其 Kernel 形状会根据图像内容自适应改变。它在权重计算中引入了两个高斯函数的乘积：

  - **Spatial distance (空域距离)**: 像素在空间位置上越近，权重越大。
  - **Range distance (值域 / 像素值差异)**: 两个像素的 Intensity (亮度/颜色) 越接近，权重才越大。
  - **结果**: 只有距离近且颜色相近的像素才会被拿来做加权平均。这样既平滑了均质区域内的噪声，又完美保留了跨越边缘的突变结构，实现了 **Edge-preserving (保边)** 。

- **Bilateral Filter 的应用**:

  - **Detail enhancement (细节增强)**: 将原图减去 Bilateral filter 平滑后的图，能分离出纯粹的 Detail (细节)，然后将 Detail 乘上一个系数加回原图，即可增强细节。
  - **Tone mapping (色调映射)**: 将拍好的 **HDR (高动态范围)** 图像压缩到 0-255 范围内显示时，直接压缩亮度会导致画面灰暗、颜色丧失。使用 Bilateral filter，可以在保留 Color 和 Detail 层不变的前提下，仅仅平滑并压缩 Large scale / Base signal (基础光照起伏)，从而得到色彩鲜艳且细节丰富的无晕影 (No halo) 显示效果。
  - **Stylization (风格化)**: 通过反复平滑和强化边缘，可以制作出类似于水彩画 (Watercolor) 的艺术风格效果。

#### 4. Advanced Filters

为了解决极端噪声或计算速度问题，Bilateral Filter 衍生出了更高级的形态：

- **Joint Bilateral Filter (联合双边滤波)**
  - **应用场景 (Flash/No-flash photography)**: 在暗光下，不开闪光灯拍的图氛围好但 Noise 极高；开闪光灯拍的图没 Noise 且边缘清晰，但颜色氛围全毁且可能有高光斑 (Highlight)。
  - **核心思想**: 在对充满噪声的暗光图 (Ambient image) 做双边滤波时，如果直接用原图算 Range distance，噪声会干扰相似度的计算。因此，利用另一张配准好的无噪声闪光灯图 (Flash image) 作为 **Reference/Guide** 来计算 Range distance (像素相似度) 权重，再把这个权重应用到暗光图的像素平均上，从而完美结合两者的优点。

- **Guided Filter (导向滤波)**:

  - **动机**: Bilateral filter 虽然好，但由于 Kernel 是非线性的，计算复杂度高达 $O(NR^2)$ (N 是像素数，R 是窗口大小)，在处理大窗口或千万像素图像时极慢。
  - **特性**: Guided filter 引入了一张 **Guide image** (引导图，可以是原图本身)。它通过极其巧妙的数学设计（利用局部窗口内的 Mean 和 Variance 均值与方差），实现了与 Bilateral filter 高度相似的 Spatially-variant 保边滤波效果。
  - **最大优势**: 其计算时间复杂度是严格的 $O(N)$，与滤波窗口大小 $R$ 无关，计算速度有了质的飞跃。
