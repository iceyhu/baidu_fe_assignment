# ife_tasks
Tasks specified by baidu-ife.

<<<<<<< HEAD
Feb 13, 2016
=======
@Feb 13, 2016
>>>>>>> origin/master
- 提交第一次的编码，大致完成
https://github.com/youknowznm/ife/tree/master/2015_spring/task/task0001 
任务7。
- 未达到的需求：
  1. 头部右侧的git图标无法在窗口宽度小于980px时自动消失。
  2. index.html中三个图片包含块的高度应一致，并且能容纳其中最长的段落。
<<<<<<< HEAD
  3. 未实现gallery.html中的瀑布流布局。
  4. 对gallery.html不同排名中表示热度的div分别定义样式，无效。
  5. 未实现index.html中的背景颜色渐变。
=======
  3. 无法实现gallery.html中的瀑布流布局。
  4. 对gallery.html不同排名中表示热度的div分别定义样式，无效。
>>>>>>> origin/master
- 存在的问题：  
  1. 两处以url形式定义的背景图片在Brackets动态预览中显示正确，但在手动打开标记时无法显示。
  2. id和class的定义混乱。越到后面越乱…且没有把结构和表现完全分离（如定义了xl, s等class来控制字体大小）。
  3. 弄不清about.html中底部的上外边距是哪来的…
<<<<<<< HEAD

Mar 2, 2016
- 第二次提交，这个月工作忙了耽搁了不少。

背景线性渐变：
	background: linear-gradient([to 方向], [色值 经过路径占总路径比], ..., [色值 经过路径占总路径比]);
高度一致且可随包含内容自适应的一行div：
	浮动定位，设置极大的负底外边距和同样大的正底内边距，并将包含框溢出属性设为hidden。
	（问题：不明白为什么浮动定位有效但换成绝对定位就无效了）
瀑布流布局：
    左上角的大部件为列0，其它为宽度固定的列1-4，每列都是ul。下部增添了清楚浮动的空div。
    列0不浮动，列1列2向左浮动，列3列4相对于包含块绝对定位。
    ·缺点：包含块的高度无法随列3列4的高度自适应，内容过多时会溢出
=======
>>>>>>> origin/master
