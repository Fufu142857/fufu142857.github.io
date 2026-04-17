# 谭平-Computer Visition

> 此笔记根据谭平老师的计算机视觉课程而做。
> 图片均来自谭平老师的PPT截图.



## 1 Introduction

CV在帮助计算机去像人一样看世界[including eyes and brain]，介绍了CV领域内研究。



## 2 Camera(相机原理)

> CV 领域非常重要的 Input 作者是相机。

```
Object -> pinhole/lense -> film
```

+ #### Pinhole

  + **Shrinking the aperture** 
    + 可以避免模糊
  + **Too small may causes** 
    + 穿过的光线太少，曝光时间很长
    + 触发干涉现象Diffraction effects，会再次变得模糊

***

+ #### Lense

  + 凸透镜，把光聚集起来
  + 相对于 Pinhole，曝光时间减短
  
  ***
  
  1. ##### **薄透镜成像原理**(Thin Lens Model) 与**成像公式**
  
     <img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251223154415278.png" alt="image-20251223154415278" style="zoom:50%;" />
     
       + 约束：只有满足方程的点才能成清晰的像。
     
       + **对焦：**Adjusting $d_i$ to choose the object in focus. 我们调整成像的位置去让像重新清晰起来。


  ***
  
  2. ##### **光圈与景深** (Aperture & Depth of Field)
  
     + **Depth of Field (DoF, 景深)**: 能够清晰成像的距离范围。
  
     + **Circle of Confusion (弥散圆)**: 当物体不在聚焦平面上时，光线在底片上汇聚成一个圆。如果这个圆足够小（小于像素大小或人眼分辨极限），我们仍认为它是清晰的。
  
  
	   + **Aperture (光圈)**: 控制进光量的孔径大小。
       $$
       光圈直径 = \frac{\text{焦距 } f}{\text{光圈数值}}
       $$
  
         + **光圈值**通常用 **f-number** 表示[$N = f / D$ (focal length/aperture diameter)]。
           + 一般焦距不能动，改变光圈直径$\to$改变光圈值$\to$影响景深
       
       
          + **权衡**:
            
              | **类型**                    | **光圈直径**    | **光圈数值**        | 曝光时间                                                     | 景深                                                         | **CV 任务应用**                                 |
              | --------------------------- | --------------- | ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------- |
              | **Large Aperture (大光圈)** | e.g. $1.8, 5.6$ | e.g. $f/1.8, f/5.6$ | $\uparrow$ 进光量大 (允许更短的曝光时间)                     | $\downarrow$ **Shallow DoF (浅景深)**: 背景虚化 (Bokeh)，只有对焦点清晰 | 适合需要分离前景/背景的任务，或者暗光环境       |
              | **Small Aperture (小光圈)** | e.g.$22, 32$    | e.g. $f/22, f/32$   | $\downarrow$ 进光量小 (需要更长的曝光时间：如果有运动的物体，会形成模糊) | $\uparrow$ **Deep DoF (深景深)**: 远近物体都清晰             | 适合需要全场景信息的任务 (如自动驾驶、安防监控) |
              
              **Risk**: 光圈过小会引发 **Diffraction (衍射)** 导致整体变糊。
  
  
  ***
  
  3. ##### 视场角Field of View & 变焦Zoom
  
     + **FOV**：相机覆盖可视范围的 **角度$\varphi$**
       $$
       \varphi = \tan ^{-1}\left(\frac{d}{2f}\right)
       $$
  
       + $d$ 为底片/传感器尺寸，$f$ 仍为焦距
       + **Zoom** 就是改变 focal length. 调小焦距得到宽视角，焦距变大视角变小。
  
       + **权衡**
  
         | **类型**              | **焦距 (f)**     | **FOV (θ)**        | **几何投影与视觉效果**                                 | **CV 任务应用**                                  |
         | --------------------- | ---------------- | ------------------ | ------------------------------------------------------ | ------------------------------------------------ |
         | **Wide Angle (广角)** | **Small** (短焦) | **Large** (宽视角) | 视野广阔，物体较小，透视畸变明显[平行线相交, 近大远小] | 自动驾驶(需看清周围路况)、全景拼接、SLAM         |
         | **Telephoto (长焦)**  | **Large** (长焦) | **Small** (窄视角) | 视野狭窄，相当于望远镜，物体被放大[平行关系几乎不变]   | 远距离监控(车牌识别)、野生动物检测、细节纹理分析 |
  
| Column1 | Column2 | Column3 | Column4 | Column5 |
| --------------- | --------------- | --------------- | --------------- | --------------- |
| Item1.1 | Item2.1 | Item3.1 | Item4.1 | Item5.1 |
| Item1.2 | Item2.2 | Item3.2 | Item4.2 | Item5.2 |

  
  4. ##### 色散 Chromatic Aberration 
  
     在图片边缘（Edge）高对比度的地方，会看到物体边缘出现非自然的紫色/绿色/红色轮廓（因为光线穿过透镜边缘时入射角更大，棱镜效应更强）。
     
     + **Corrections:** add 'doublet' lens of flint glass, etc. - 加透镜弥补色散现象
     
  5. ##### 镜头畸变 Radial Distortion
  
     + 表现为直线变弯
  
     + 这种畸变是**径向的 (Radial)** ，即沿着半径方向对称。离图像中心越远，畸变越严重。
  
     + ##### 三种类型
  
        + **Orthoscopic (无畸变/正像)**: 理想的小孔成像模型
        + **Barrel Distortion (桶形畸变)**，向外膨胀
           <img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251225144810114.png" alt="image-20251225144810114" style="zoom:25%;" />
        + **Pincushion Distortion (枕形畸变)**，向内收缩
           <img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251225144831376.png" alt="image-20251225144831376" style="zoom:25%;" />
        
  + **Correction**
    
     在做几何视觉（如 3D 重建、SLAM）前，必须先进行 **Undistortion (去畸变)**。
  
  
  ****
  
  总而言之，理解凸透镜即理解 **成像原理 (Thin Lens Model)** 与 **成像公式**。我们需要掌握相机参数如何决定拍摄结果，从而根据需求调整参数：1️⃣**Focusing (对焦)**就是调整像距 $d_i$，让特定距离的物体成像清晰2️⃣在不改变焦距的前提下，调整孔径大小，使景深变化去权衡背景虚化（大光圈）与全景清晰（小光圈）3️⃣**Zoom (变焦)**则是在不改变底片尺寸的同时调整焦距 $f$，使FOV变化，实现广角（大场景/透视强）或长焦（特写/压缩感）4️⃣最后还有修正工作，可以使用复合透镜抵消 **色差**，用几何变换消除 **镜头畸变**。



***

待整理（呃呃

+ ### Related Research 

  + 无意中形成的针孔相机
    <img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251225103919764.png" alt="image-20251225103919764" style="zoom:50%;" />

​	观察生活发现屋子里的墙上有黑白斑驳。
​	我不能把窗户关起来、做很小的针孔 $\to$ 我可以怎么去构造针孔相机？

<img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251225105138168.png" alt="image-20251225105138168" style="zoom: 50%;" />

<img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251225105203083.png" alt="image-20251225105203083" style="zoom:50%;" />

difference？原理是什么

+ 控制lcd口的透明度
  <img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251225105320809.png" alt="image-20251225105320809" style="zoom:50%;" />

<img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251225105456515.png" alt="image-20251225105456515" style="zoom: 50%;" />

+ 具体做法：

  + lcd开三个小口
  + 两层lcd

  <img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251225105637436.png" alt="image-20251225105637436" style="zoom:55%;" />
  实现不连续的 FOV



## 3 Color

> 

![image-20260305204137949](/Users/a1-6/Library/Application Support/typora-user-images/image-20260305204137949.png)

给到颜色，能够通过函数计算出来

颜色空间

+ Linear transform from XYZ to sRGB

+ #### YUV Color Space

  > 帮助做视频和图像的压缩

  + Y 亮度值

  + U和V 整体描述了颜色

    > 人眼对 U 和 V 不敏感，可以把这个压缩得很厉害。

+ 加法用RGB，减法（比如滤光片）CMY
  + RGB 比 CMY 还原颜色更好
  + CMY 光更多，性价比更高

![image-20260305210135150](/Users/a1-6/Library/Application Support/typora-user-images/image-20260305210135150.png)
Demosaicing

人眼对绿光更敏感

![image-20260305211242554](/Users/a1-6/Library/Application Support/typora-user-images/image-20260305211242554.png)

多光谱图像应用

> 普通 RGB 相机，引入其他光谱频段

+ 光对不同皮肤的反射不一样

  不同波长的光对皮肤的穿透深度和吸收率完全不同。

+ 墨迹的反射率也不一样就能还原



## 3 Radiometric Calibration & HDR

> 光的强度 -> 像素值（数字表示）

+ #### Preliminary Terms

  + Radiance

    单位面积、单位时间、单位空间角 发出的能量

  + Irradiance

    单位面积、单位时间 接收到的能量

+ #### Radiometric Calibration 

  1. ##### 核心前提： 相机的非线性响应

  - **"Cameras have non-linear responses in terms of exposure"**：

    现实中，相机的传感器接收到的光子数量（曝光量）与最终输出的图像像素值（0-255）之间，并不是简单的正比例（线性）关系。为了压缩动态范围或让照片色彩更符合人眼的视觉习惯，相机硬件或内部软件会对收集到的光信号施加一个非线性的数学变换。

  ##### 2. 公式解析：图像的生成过程

  PPT给出了相机成像的数学模型：

  $$Z_{ij} = f(E_i * \Delta t_j)$$

  - $E_i$：第 $i$ 个像素所接收到的真实**辐射照度（Irradiance）**，代表现实世界中该点的客观光强度。
  - $\Delta t_j$：第 $j$ 次拍摄时的**快门时间（Shutter speed）**。
  - $E_i * \Delta t_j$：这两者相乘即为**曝光量（Exposure）**，也就是传感器在快门开启期间收集到的总光能。
  - $f$：**相机响应函数（Camera Response Function, CRF）**。这就是前面提到的那个未知的“非线性处理过程”。
  - $Z_{ij}$：最终图像文件里存储的数字**像素值**（通常是 0 到 255 之间的整数）。

  ##### 3. 辐射标定的目的

  - **"Radiometric calibration amounts to recover the response function"**：

    辐射标定的根本任务，就是通过算法**求解出这个未知的响应函数 $f$**。

+ #### HDR High Dynamic Range

  To capture both **dark** and **bright** areas in an image.

+ #### Algorithm to find the response function

  $$
  \log Exposure = \log Irradiance + \log \Delta t
  $$

  ![image-20260306132617853](/Users/a1-6/Library/Application Support/typora-user-images/image-20260306132617853.png)

  通过物理知识写出公式，经常要加 smoothness 约束



## 4 Reflaction and lighting

![image-20260309132039837](/Users/a1-6/Library/Application Support/typora-user-images/image-20260309132039837.png)
