### Introduction

#### 一、 课程与讲师简介
* **讲师信息**:本课程由加州大学圣塔芭芭拉分校（UCSB）的助理教授 Lingqi Yan（闫令琪）主讲。他的主要研究方向是计算机图形学中的 Rendering（渲染），其研究成果曾被电影《狮子王》广泛采用，并曾获得奥斯卡最佳视觉效果奖提名。
* **什么是 Computer Graphics (计算机图形学)**:简而言之，它是指利用计算机来合成（synthesize）和操作（manipulate）视觉信息的科学。

#### 二、 计算机图形学的广泛应用 (Applications)
纯粹从技术的角度来说，如果一项渲染技术能把画面做得足够明亮真实（例如运用了优秀的 Global Illumination 全局光照技术），或者能展现独特的艺术风格，这就是好的图形学应用。图形学在当今的各行各业中都有着核心的作用：
1.  **Video Games (电子游戏)**:如《只狼》中通过 Global Illumination 呈现的明亮舒适的画面，以及《无主之地3》中独特的卡通渲染风格。
2.  **Movies (电影)**:通过图形学合成 Special effects (特效)，如《黑客帝国》中的子弹时间，或像《阿凡达》中广泛应用的人物面部与动作捕捉技术，让虚拟人物做出真实的表情和运动。
3.  **Animations (动画)**:渲染极度复杂的细节。例如在《疯狂动物城》中，渲染数百万根与光线发生复杂作用的动物毛发；或在《冰雪奇缘2》中运用 Simulation (模拟) 技术生成烟雾、发光粒子以及衣物在风中的碰撞与变形。
4.  **Design (设计)**:Computer Aided Design (CAD) 被用于汽车制造或室内装潢。设计师可以在虚拟环境中调节环境光并实时查看车身曲面的反光效果，甚至宜家（IKEA）产品目录中 75% 的图片都是纯计算机渲染生成的虚拟图像。
5.  **Visualization (可视化)**:将 CT 或核磁共振扫描出的海量三维信息，或是雇佣增长率等抽象数据，转化为人类肉眼易于理解的视觉图像。
6.  **Virtual Reality (VR) / Augmented Reality (AR)**:VR 让用户完全沉浸在计算机生成的画面中看不到现实，而 AR（如微软 HoloLens）则是在现实世界的基础上叠加虚拟的三维物体，方便进行交互式设计。
7.  **Simulation (模拟)**:不仅指微观的沙尘暴（粒子模拟），也包括运用物理法则模拟光线在黑洞附近的偏折（如电影《星际穿越》）。
8.  **GUI & Typography (图形用户界面与字体设计)**:涵盖操作系统的视觉交互设计，以及运用矢量 (Vector) 技术使得字号无论被放大多少倍都能保持边缘平滑清晰的字体排版艺术。

#### 三、 课程核心内容 (Course Topics)
本课程是一门现代图形学入门课，主要涵盖以下四大核心模块：

1.  **Rasterization (光栅化)**:
  * 将三维空间中的几何形体（如三角形）投影到二维屏幕上，并将其打碎成屏幕上的 Fragment/Pixel (像素)。
  * 它是目前游戏等 Real-time (实时) 应用的黄金标准。在图形学中，Real-time 通常指每秒能生成至少 30 帧 (30 fps) 画面。

2.  **Curves and Meshes (曲线与曲面 / 几何)**:
  * 研究如何在计算机中表示复杂的几何形状，例如通过 Bezier Curve (贝塞尔曲线) 或者曲面细分 (Subdivision) 方法来描绘光滑的表面并保持物体的拓扑结构。

3.  **Ray Tracing (光线追踪)**:
  * 从相机向每个像素发射光线，计算交点与着色，并模拟光线在光源和不同材质物体之间的不断弹跳。
  * 它能生成极度真实的画面，是电影和动画等 Offline (离线) 应用的黄金标准。
  * 图形学中常常存在 Trade-off (权衡)，光线追踪虽然效果好但计算速度较慢，目前业界也正在研发实时的光线追踪技术。

4.  **Animation / Simulation (动画与物理模拟)**:
  * 探讨 Key frame Animation (关键帧动画) 与 Mass-spring System (质点弹簧系统) 等，精确计算和模拟现实世界中的物理规律，如球的弹性碰撞、布料悬挂时的褶皱下垂等。

#### 四、 课程“不包含”的内容 (What GAMES101 is NOT about)
了解这门课不教什么，有助于更好地把握学习方向：
1.  **不教授具体的 Graphics APIs (图形应用程序接口)**:本课不教如何调用 OpenGL, DirectX 或 Vulkan，也不教 Shader (着色器) 的具体语法。课程的核心理念是 **"Learn graphics, not graphics APIs"** 。只要掌握了背后的算法、数据结构和工作原理，课后你绝对有能力自学并掌握任何图形学 API。
2.  **不教授三维软件操作与游戏开发**:不教如何使用 Maya, 3DS MAX 或 Blender 建模，也不教如何使用 Unity 或 Unreal Engine 等游戏引擎去搭建场景和 AI。
3.  **不涉及 Computer Vision (计算机视觉) 与 Deep Learning (深度学习)**:
  * **区别**:Computer Vision 主要是基于一幅已有的图像去“猜测 (Guess)”和推理三维结构、做语义分割或人脸识别，这是一个从 **Image (图像) 逆推到 Model (模型)** 的过程。
  * 而 Computer Graphics (尤其是 Rendering) 是基于定义好的三维几何模型、材质和光照去生成一幅图，是一个从 **Model (模型) 到 Image (图像)** 的正向过程。

#### 五、 课程要求与学习建议 (Course Logistics)
* **硬件要求**:由于不涉及底层硬件编程，你不需要购买昂贵的显卡 (如 RTX 2080Ti) 来完成作业。
* **编程与作业**:
  * 采用 **C++** 作为编程语言。业界标准广泛使用 C++ 进行图形学编程，不建议使用 Python 是因为它在进行大量像素级循环时性能太弱。
  * 作业会提供预先配置好的 Virtual Machine (虚拟机) 以及代有少量缺失代码的 Skeleton (代码框架)，每周的代码量通常不超过 20 行。作业通过特定的在线系统（SmartChair）提交。
* **开发工具建议**:
  * 强烈要求使用 **IDE (Integrated Development Environment / 集成开发环境)** ，如 Visual Studio (Windows)、Visual Studio Code (跨平台) 或 Qt Creator。
  * **极不推荐**使用纯文本编辑器（如 Sublime Text, Vim, Emacs），因为大型工程需要依靠 IDE 提供强大的代码分析、语法提示和自动补全等功能来提高开发效率。
* **参考书籍**:无需强制购买教材，但强烈推荐《Fundamentals of Computer Graphics》（俗称“虎书/Tiger book”，建议阅读第三版及以上）作为辅助阅读材料。
* **考核与学术诚信**:课程没有考试 (No Exams)，但鼓励大家在课程后期利用所学知识做一个 Final Project 来展示自己的成果。作业必须独立完成，严禁在网络上公开带有答案的代码框架以保证 Academic integrity (学术诚信)。
