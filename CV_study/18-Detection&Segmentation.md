### Detection & Segmentation 

#### 1 From classification to detection
* **Image Classification (图像分类)**: 假设图像中只有一个占据主导地位的物体，网络只需要输出它是什么（如猫、狗、汽车），不关心其具体位置。
* **Classification with Localization (分类与定位)**: 图像中仍然只有一个主要物体，但除了输出类别，系统还需要找到物体的具体位置，通常用一个 **Bounding box (边界框)** 把物体框出来。
  * **实现原理**: 网络在末端分为两个分支。一个是传统的分类分支，输出各类别的得分并使用 Softmax Loss；另一个是回归分支，直接输出 Bounding box 的坐标（如中心点 $x, y$ 以及宽高 $w, h$），并使用 L2 Loss (欧氏距离误差) 与人工标注的 Ground truth 对比。
  * 最后将这两个 Loss 相加，通过 Back propagation (反向传播) 共同训练网络。
* **Detection (目标检测)**: 图像中存在**多个**不同类别的物体。系统需要找出所有物体，进行分类，并为每个物体画出 Bounding box。这比单纯的分类或单目标定位要困难得多。

#### 2 二、 目标检测的基础构建块
为了在图像中寻找未知位置和大小的物体，早期衍生出了以下基础技术：
* **Sliding Window (滑动窗口)**: 用一个固定大小的窗口在图像上逐像素滑动，把每次框出的局部图像 (Patch) 喂给神经网络进行分类（例如判断是猫、狗还是背景）。
  * **缺点**: 计算量极大。因为物体可能有不同的大小和长宽比 (Aspect ratio)，需要用各种尺寸的窗口在整张图上反复滑动。
* **IoU (Intersection over Union, 交并比)**: 用于衡量两个 Bounding box 重叠程度的数学指标。计算公式为：两个框**相交 (Intersection)** 的面积，除以它们**相并 (Union)** 的面积。
* **NMS (Non-maximum Suppression, 非极大值抑制)**: 当使用滑动窗口时，同一个物体（如一辆车）可能会被相邻的多个窗口同时检测到。NMS 的做法是：挑选出分类置信度 (Confidence/Probability) 最高的那个框，然后将周围与它 IoU 大于某个阈值（如 0.5）的其他多余检测框全部剔除。
* **Region Proposal (区域提议)**: 为了避免滑动窗口的盲目搜索，引入了自底向上的快速算法（如通过超像素合并）。它能在一张图中快速筛选出约 2000 个“可能包含物体”的候选方框。后续的精细分类只需要在这 2000 个 Proposal 中进行即可，大幅减少了计算量。

#### 三、 R-CNN 家族的演进 (两阶段检测器)
结合 Region Proposal 和 CNN，研究界发展出了经典的 R-CNN 系列算法：

**1. R-CNN (Region-based CNN)**
* **流程**: 针对图像生成一堆 Region proposal $\rightarrow$ 把每个候选框里的图像 Crop (裁剪) 并 Warp (缩放/变形) 到固定尺寸 $\rightarrow$ 逐个送入 CNN 提取特征 $\rightarrow$ 使用 SVM 进行分类并回归 Bounding box 坐标。
* **致命缺点**: 极度缓慢（处理一张图约需 50 秒）。因为大量的候选框之间有严重的重叠 (Overlap)，相同的图像区域被不同的候选框反复送入 CNN 进行独立的卷积计算，造成了巨量的计算浪费。

**2. Fast R-CNN**
* **核心改进 - Computation Reuse (计算复用)**: 不再单独裁剪原图。而是把**整张原图**一次性送入 CNN 提取出全局的 **Feature map (特征图)** 。
* **RoI Pooling (感兴趣区域池化)**: 得到全局特征图后，将之前生成的 Region proposal 直接映射到 Feature map 上。由于全连接层需要固定大小的输入（如 7x7），而候选框大小不一，系统会在特征图的候选区域内划分出 7x7 的网格，并在每个网格内做 Max pooling，从而将任意尺寸的特征区域转化为统一尺寸送入后续网络。
* **速度提升**: 通过共享卷积层的计算，测试时间缩短到了 2.3 秒/张。

**3. Faster R-CNN**
* **核心改进**: Fast R-CNN 的瓶颈变成了依赖外部算法生成 Region proposal。Faster R-CNN 直接在网络内部增加了一个 **RPN (Region Proposal Network)** 层，让神经网络自己去极速生成候选框。
* **速度**: 将测试时间进一步压缩到了 0.2 秒/张 (约 5 FPS)，真正实现了端到端 (End-to-end) 的训练。

#### 四、 单阶段检测算法 (One-Stage Detectors)
为了在移动设备上实现几十帧每秒的严格实时性 (Real-time)，诞生了不生成 Proposal、只看一眼图像就能直接出结果的单阶段算法：

**1. YOLO (You Only Look Once)**
* **核心思想**: 把输入图像划分成网格 (Grid，例如 3x3 或 20x20)。如果某个物体的中心点落在了某个网格 (Cell) 内，这个网格就负责检测该物体。
* **网络输出**: 每个网格直接输出 $B$ 个 Bounding box（包含框的坐标和存在物体的 Confidence）以及 $C$ 个类别的概率得分。即每个 Cell 输出 $B \times 5 + C$ 个数值。
* **Anchor Box (锚框)**: 如果两个物体的中心点落在了同一个网格里怎么办？YOLO 引入了预先手工设计好的不同长宽比的 Anchor boxes（如一个横向的框负责汽车，一个纵向的框负责行人）。每个网格针对不同的 Anchor box 独立输出预测，从而解决了多个物体中心重合的冲突。

**2. SSD (Single Shot MultiBox Detector)**
* **核心优势**: 比 YOLO 更快且更准。
* **Multi-resolution Feature Maps (多分辨率特征图)**: 物体有大有小，只在最后一层固定的网格上预测容易漏检。SSD 的巧妙之处在于，它在 CNN 不断缩小特征图的过程中，从**多个不同分辨率**的特征图层级上同时提取信息进行预测。在粗糙的小特征图上预测大物体，在精细的大特征图上预测小物体，并在每个像素位置结合不同尺寸的 Anchor box 进行回归。

#### 五、 Image Segmentation (图像语义分割)
Segmentation 的目标不再是画框，而是为图像中的**每一个像素 (Every single pixel)** 打上类别标签（如树木、天空、草地）。

* **计算难题**: 如果对每个像素周围取一个 Patch 去做 CNN 分类，计算量大到不可接受。必须利用相邻像素间的卷积运算进行复用。
* **Downsampling & Upsampling (下采样与上采样架构)**: 
  * 如果一直在原图分辨率上做卷积，内存和计算量会爆炸。因此，标准的分割网络通常采用类似沙漏的结构：先在卷积过程中使用 Stride 大于 1 进行 **Downsampling (下采样)** ，缩小空间分辨率并提取高维语义特征。
  * 然后，必须通过 **Upsampling (上采样)** 将变小的特征图重新放大回原始图像的分辨率，以便进行逐像素的预测。
* **Upsampling 的方法**: 
  * 基础方法包括：最近邻复制 (Nearest neighbor)、补零插入 (Bed of nails)、或者记录之前 Max pooling 位置的 Max unpooling。
  * **Transpose Convolution (转置卷积 / 反卷积)**: 一种更高级、**参数可学习 (Learnable)** 的上采样方法。它使用一个可学习的权重核，将输入特征图上的一个单一数值，按权重比例“分散 (Distribute)”映射到输出层的一个更大的局部区域中（重叠部分相加）。由于其权重可以通过 Back propagation 学习，它能恢复出比传统插值平滑得多的边缘细节。
