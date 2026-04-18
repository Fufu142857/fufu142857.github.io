### SLAM Simultaneous Localization And Mapping

#### 一、 SLAM 核心概念
* **什么是 SLAM**: SLAM 全称是 **Simultaneous Localization and Mapping (同时定位与建图)** 。它解决的是当传感器（如相机或激光雷达）进入一个全新的未知环境时，如何一边移动一边绘制环境地图，同时根据这张地图确认自己位置的问题。
* **两大核心任务**:
  * **Localization (定位)**: 估算传感器在地图中的 **Pose (姿态)** 。Pose 不仅仅包含二维或三维的 X/Y/Z 位置 (Location)，还必须包含传感器的朝向 (Orientation)。
  * **Mapping (建图)**: 为这个未知的环境建立一个结构化的地图。
* **Chicken-and-egg Problem (鸡生蛋与蛋生鸡的困境)**: 如果要精准定位，你必须先有一张精确的地图；但如果你想绘制精确的地图，你又必须确切知道传感器在每个时刻的 Pose。SLAM 的核心算法就是为了解决这个互相依赖的死结。

#### 二、 2D LiDAR SLAM (以激光雷达为例的 SLAM 基础)
为了更容易理解 SLAM 的基本模块，课程首先以 2D 激光雷达 (LiDAR) 为例进行剖析。2D LiDAR 假设机器人在一个大平面内运动，传感器不断旋转打出激光束来测量周围一圈障碍物的距离。

* **地图表示 (Occupancy Grid Map)**: 
  * 将二维平面划分成细小的网格（例如 5cm x 5cm）。
  * 每个网格有三种状态：**Free space (空闲，激光可穿透)**、**Occupied (被占据/有障碍物，激光在此终止)** 以及 **Unknown (未知区域)** 。
  * **Mapping (已知 Pose 求地图)**: 当传感器的 Pose 已知时，将每一根测距激光射线投射到网格中。射线途经的网格投票为 Free，射线终点投票为 Occupied。综合多个视角的投票即可生成完整的 Occupancy Grid Map。

* **追踪定位 (Tracking via ICP)**:
  * **ICP (Iterative Closest Point)**: 如果地图已知，当激光雷达扫描到新的一圈点云时，需要用 ICP 算法来进行点云匹配以计算 Pose。
  * 算法会为当前扫描到的每一个点，在现有地图中寻找 **Nearest/Closest point (最近邻点)** 。找到对应关系后，求解一个最优的 Rotation (旋转) 和 Translation (平移) 让当前扫描点贴合到地图上。然后利用新姿态重新寻找最近邻点，不断迭代直到收敛。

* **完整的 SLAM 流程**:
  1.  **Initialization (初始化)**: 第一圈扫描的数据直接作为初始地图。
  2.  **Tracking (追踪)**: 传感器移动后，用 ICP 算法将当前扫描与地图匹配，求出最新的 Pose。
  3.  **Mapping (建图)**: 利用求出的最新 Pose，将当前扫描的数据融合更新到 Occupancy Grid Map 中。如此循环往复。

#### 三、 Visual SLAM (视觉 SLAM)
Visual SLAM 本质上是将 Structure from Motion (SfM) 技术应用在连续的视频序列 (Video sequence) 上，并采用增量式 (Incremental) 的方法逐帧求解。

* **完整的 SLAM 流程**:
  1.  **Initialization (初始化)** essential matrix, Triangulation, etc.
  2. **Pose Tracking**: Feature tracking bext next + Pose-only BA
  3.  **Mapping (建图)**: Triangulation, BA; Loop closure, pose-graph.


* **与传统 SfM 的区别**:
  * **Real-time (实时性)**: SLAM 为机器人导航等服务，必须保证严格的实时计算。
    - Keyframe-based
    - local BA
  * **Sequential Input (时序输入)**: 视频帧是连续的，因此特征匹配 (Feature correspondence) 只需要在相邻帧之间进行，且可以利用匀速运动假设来预测相机的初始姿态，大大简化了运算。

* **Keyframe-based SLAM (基于关键帧的架构)**:
  为了满足实时性，现代视觉 SLAM（如经典算法 PTAM 或 ORB-SLAM2）通常采用双线程或多线程架构。
  * **Tracking Thread (追踪线程 - 严格实时)**: 负责每秒处理 30 帧图像，仅计算 Camera Pose。它通过 KLT 光流法或局部特征匹配找到与上一帧的对应关系，然后利用 **Camera-only Bundle Adjustment (仅相机的光束法平差)** 来快速优化当前帧的姿态。为了提速，此时会固定住 3D 地图点的坐标。
  * **Mapping Thread (建图线程 - 后台运行)**: 负责维护和优化三维地图。它不会处理每一帧，而是只处理 **Keyframe (关键帧)** 。当有新的 Keyframe 插入时，它会进行 **Triangulation (三角化)** 生成新的 3D 点，并调用 Local Bundle Adjustment 来联合优化局部相机的姿态和 3D 点坐标。
* **如何挑选 Keyframe (关键帧)**:
  选取准则通常包括：当前相机的追踪误差较小（Pose 准确）；特征点丢失严重需要补充；相机发生了较大幅度的旋转或平移；或者距离上一个关键帧已经过了较长的时间。

#### 四、 高阶鲁棒性技术 (Robustness Techniques)
真实的视觉环境中充满了挑战，完善的 SLAM 系统必须具备以下高级恢复与优化功能。

* **Relocalization (重定位)**:
  * 当遇到运动模糊 (Motion blur)、被移动物体挡住 (Moving object/Occlusion)、剧烈运动或光照突变时，相机的 Tracking 会彻底丢失 (Lost)。
  * 恢复方法：通过 **Image search (图像检索，通常基于 Bag of Words 模型)** ，在历史建好的地图中寻找与当前视野相似的 Keyframe。找到后建立特征匹配，并通过 PnP (Perspective-n-Point) 等算法重新计算出相机姿态，从而让系统“满血复活”。

* **Localization (离线建图与在线定位分离)**:
  * 一种将 Mapping 和 Tracking 彻底拆分到不同时间阶段的玩法。
  * 先离线 (Offline) 花大量时间建立一个极其高精度的全图 Map（例如跑遍整个校园）。后续机器人实际运行时，直接加载该地图，只运行在线的 Localization/Tracking 模块。优点是效率极高且地图质量好，缺点是难以应对环境的长期变化（如白天变黑夜、夏天变冬天）。

* **Loop Closure (回环检测与优化)**:
  * **Drifting Error (漂移误差)**: SLAM 在长期运行中，微小的计算误差会不断累积。导致机器人绕一大圈回到原点时，地图和轨迹无法闭合。
  * **Loop Detection (回环检测)**: 使用 Image search 发现当前相机看到的画面在很久以前的历史帧中也出现过（即走回了老路）。
  * **Pose Graph Optimization (姿态图优化)**: 一旦检测到回环，不能简单地跑全局 Bundle Adjustment（因为误差太大无法收敛）。系统会将每个 Keyframe 视为顶点 (Vertex)，帧与帧之间的相对运动视为边 (Edge) 构建一个 **Pose Graph** 。然后利用 Global SfM 的思想进行全局姿态图优化，将累积的误差均匀地分摊到整条轨迹中，从而完美拉齐整个地图。
