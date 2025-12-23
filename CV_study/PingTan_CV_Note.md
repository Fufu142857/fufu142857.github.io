# 谭平-Computer Visition

> 此笔记根据谭平老师的计算机视觉课程而做。



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



+ #### Lense

  + 凸透镜，把光聚集起来

  + 相对于 Pinhole，曝光时间减短

    

  1. ##### **薄透镜成像原理**(Thin Lens Model) 与**成像公式**

     <img src="/Users/a1-6/Library/Application Support/typora-user-images/image-20251223154415278.png" alt="image-20251223154415278" style="zoom:50%;" />

    + 约束：只有满足方程的点才能成清晰的像。
    + 对焦：Adjusting $d_i$ to choose the object in focus. 我们调整成像的位置去让像重新清晰起来。

  

  2. ##### **光圈与景深** (Aperture & Depth of Field)

  + **Aperture (光圈)**: 控制进光量的孔径大小。
    $$
    光圈直径 = \frac{\text{焦距 } f}{\text{光圈数值}}
    $$

      + **光圈值**通常用 **f-number** 表示: $N = f / D$ (焦距/光圈直径)。


    + **Depth of Field (DoF, 景深)**: 能够清晰成像的距离范围。

    + **Circle of Confusion (弥散圆)**: 当物体不在聚焦平面上时，光线在底片上汇聚成一个圆。如果这个圆足够小（小于像素大小或人眼分辨极限），我们仍认为它是清晰的。


   + **权衡**:
       1.  **Large Aperture (大光圈, e.g., $f/1.8, f/5.6$)**:
           + $\uparrow$ 进光量大 (允许更短的曝光时间)。
           + $\downarrow$ **Shallow DoF (浅景深)**: 背景虚化 (Bokeh)，只有对焦点清晰。
           + *CV应用*: 适合需要分离前景/背景的任务，或者暗光环境；拍人像。
       2.  **Small Aperture (小光圈, e.g., $f/22, f/32$)**:
           + $\downarrow$ 进光量小 (需要更长的曝光时间)。
           + $\uparrow$ **Deep DoF (深景深)**: 远近物体都清晰。
           + *Risk*: 过小会引发 **Diffraction (衍射)** 导致整体变糊。
           + *CV应用*: 适合需要全场景信息的任务 (如自动驾驶、安防监控)；拍全景。
