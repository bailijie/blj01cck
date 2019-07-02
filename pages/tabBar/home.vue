<template>
	<view>
		<view class="banner">
			<image src="../../static/banner.png" mode=""></image>
			<view class="jianB">
				<image src="../../static/logo2.png" mode=""></image>
				<view class="">
					<view style="font-size: 28upx; font-weight: 500;">资深鉴定团队，全国权威鉴定专家</view>
					<view style="color: #999999; font-size: 24upx;">全国权威鉴定专家帮您鉴定</view>
				</view>
			</view>
		</view>
		<!-- <view @tap="fffx" style="padding-left: 20upx; margin-left: 30upx; border-left: #CFB789 10upx solid; margin-top: 80upx; font-size: 32upx;" class="">分享朋友圈</view> -->
		<view class="">
			<view style="padding-left: 20upx; margin-left: 30upx; border-left: #CFB789 10upx solid; margin-top: 80upx; font-size: 32upx;" class="">推荐专家</view>
			<view class="grace-margin">
				<view class="grace-news-list" style="margin-top:10px;">
					<view class="item" v-for="(item, index) in expertList" :key="index">
						<view class="img-title"><image mode="" :src="item.icon"></image></view>
						<view class="body">
							<view style="display: flex; justify-content: space-between; align-items: center;" class="">
								<view class="title">{{ item.expertName }}</view>
								<!-- <view class="price">咨询价格￥{{ item.price }}</view> -->
							</view>
							<view class="desc">简介:{{ item.expertIntro }}</view>
							<!-- <view class="be-good-at">擅长:{{ item.expertClumn }}</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding-left: 20upx; margin-left: 30upx; border-left: #CFB789 10upx solid; margin-top: 80upx; font-size: 32upx;" class="">专家鉴赏</view>
		<view id="moments">
			<view class="moments__post" v-for="(post, index) in posts" :key="index" :id="'post-' + index">
				<view class="post-left">
					<image class="post_header" :src="post.member.icon"></image>
					<view style="">
						<text class="post-username">{{ post.member.username }}</text>
						<view style="font-weight: 400;font-size: 24upx;color: #999999;">{{ post.createTime }}</view>
					</view>
				</view>
				<view class="post_right">
					<view id="paragraph" class="paragraph">{{ post.productName }}</view>
					<view id="paragraph" class="paragraph">{{ post.productIntroduce }}</view>
					<!-- 相册 -->
					<view class="thumbnails">
						<view :class="post.content.images.length === 1 ? 'my-gallery' : 'thumbnail'" v-for="(image, index_images) in post.orderPicList" :key="index_images">
							<image class="gallery_img" lazy-load mode="aspectFill" :src="image.pic" :data-src="image" @tap="previewImage(post.orderPicList, index_images)"></image>
						</view>
					</view>
					<!-- 资料条 -->
					<view class="toolbar">
						<!-- <view class="like" @tap="like(index)"><image :src="post.islike === 0 ? '../../static/index/islike.png' : '../../static/index/like.png'"></image></view> -->
						<!-- <view class="like" @tap="comment(index)"><image src="../../static/index/comment.png"></image></view> -->
						<button class="comment" open-type="share"><image src="../../static/index/copy.png"></image></button>
					</view>
					<!-- 赞／评论区 -->
					<view class="post-footer">
						<!-- <view class="footer_content">
							<image class="liked" src="../../static/index/liked.png"></image>
							<text class="nickname" v-for="(user, index_like) in post.like" :key="index_like">{{ user.username }}</text>
						</view> -->
						<view class="footer_content">
							<view class="Result">
								鉴定结果 :
								<view class="type" v-if="post.isReal == 1" :class="{ jin: post.isReal == 1 }"><text>真品</text></view>
								<view class="type" v-if="post.isReal == 2"><text>赝品</text></view>
								<view class="type" v-if="post.isReal == 3" :class="{ hui: post.isReal == 3 }"><text>存疑</text></view>
							</view>
							<text class="comment-nickname">
								专家评价 :
								<text class="comment-content">{{ post.expertComment }}</text>
							</text>
						</view>
					</view>
				</view>
				<!-- 结束 post -->
			</view>
			<view class="foot" v-show="showInput">
				<chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input>
				<!-- <chat-input @send-message="send_comment" @blur="blur" :placeholder="input_placeholder"></chat-input> -->
			</view>
			<view class="uni-loadmore" v-if="showLoadMore">{{ loadMoreText }}</view>
		</view>
	</view>
</template>

<script>
// import chatInput from '../../components/im-chat/chatinput.vue'; //input框
// import postData from '../../common/index/index.post.data.js'; //朋友圈数据
export default {
	components: {
		// chatInput
	},
	data() {
		return {
			imageUrl: '',
			actions: [],
			posts: [],
			user_id: '',
			wxTit: '',
			username: '',
			index: '',
			comment_index: '',
			userName: '',
			userAvatar: '',
			input_placeholder: '评论', //占位内容
			focus: false, //是否自动聚焦输入框
			is_reply: false, //回复还是评论
			showInput: false, //评论输入框

			screenHeight: '', //屏幕高度(系统)
			platform: '',
			windowHeight: '', //可用窗口高度(不计入软键盘)

			// loadMoreText: '加载中...',
			showLoadMore: false,
			expertList: [],
			pageSize: 2
		};
	},
	mounted() {
		uni.getSystemInfo({
			//获取设备信息
			success: res => {
				this.screenHeight = res.screenHeight;
				this.platform = res.platform;
			}
		});
		// uni.startPullDownRefresh();
	},
	onLoad() {
		this.userName = uni.getStorageSync('userName');
		this.userAvatar = uni.getStorageSync('userAvatar');
		uni.showShareMenu({
			withShareTicket: true
		});
		if (!this.isLogin()) {
			uni.redirectTo({
				url: '/pages/login/accredit'
			});
		}
		let _this = this;
		this.$ajax
			.get({
				url: '/user/listMaster?status=0&masterId=0&pageNum=0&pageSize=0'
			})
			.then(res => {
				_this.expertList = res.data.data;
				// console.log(_this.actions);
			});
		this.$ajax
			.get({
				url: '/fenxiang/selectShare'
			})
			.then(res => {
				_this.wxTit = res.data.data.title;
				_this.imageUrl = res.data.data.url;
				// console.log(_this.actions);
			});
	},
	onShow() {
		let _this = this;
		this.$ajax
			.get({
				url: '/home/APPcontent',
				param: {
					pageSize: 9999,
					pageNum: 1
				}
			})
			.then(res => {
				console.log(res.data.data);
				_this.posts = res.data.data;
			});
		// uni.onWindowResize(res => {
		// 	//监听窗口尺寸变化,窗口尺寸不包括底部导航栏
		// 	if (this.platform === 'ios') {
		// 		this.windowHeight = res.size.windowHeight;
		// 		this.adjust();
		// 	} else {
		// 		if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
		// 			this.windowHeight = res.size.windowHeight;
		// 			this.adjust();
		// 		}
		// 	}
		// });
	},
	onHide() {
		// uni.offWindowResize(); //取消监听窗口尺寸变化
	},
	onUnload() {
		(this.max = 0), (this.data = []), (this.loadMoreText = '加载更多'), (this.showLoadMore = false);
	},
	// onReachBottom() {
	// 	//监听上拉触底事件
	// 	console.log('onReachBottom');
	// 	this.showLoadMore = true;
	// 	setTimeout(() => {
	// 		//获取数据
	// 		if (this.posts.length < 5) {
	// 			//测试数据
	// 			this.posts = this.posts.concat(this.posts);
	// 		} else {
	// 			this.loadMoreText = '暂无更多';
	// 		}
	// 	}, 1000);
	// },
	// onPullDownRefresh() {
	// 	//监听下拉刷新动作
	// 	console.log('onPullDownRefresh');
	// 	// 这里获取数据
	// 	setTimeout(function() {
	// 		//初始化数据
	// 		uni.stopPullDownRefresh(); //停止下拉刷新
	// 	}, 1000);
	// },
	// onNavigationBarButtonTap(e) {
	// 	//监听标题栏点击事件
	// },
	computed: {},
	methods: {
		like(index) {
			if (this.posts[index].islike === 0) {
				this.posts[index].islike = 1;
				this.posts[index].like.push({
					uid: this.user_id,
					username: ',' + this.username
				});
			} else {
				this.posts[index].islike = 0;
				this.posts[index].like.splice(
					this.posts[index].like.indexOf({
						uid: this.user_id,
						username: ',' + this.username
					}),
					1
				);
			}
		},
		comment(index) {
			this.showInput = true; //调起input框
			this.focus = true;
			this.index = index;
		},
		adjust() {
			//当弹出软键盘发生评论动作时,调整页面位置pageScrollTo
			return;
			uni.createSelectorQuery()
				.selectViewport()
				.scrollOffset(res => {
					var scrollTop = res.scrollTop;
					let view = uni.createSelectorQuery().select('#post-' + this.index);
					view.boundingClientRect(data => {
						console.log('data:' + JSON.stringify(data));
						console.log('手机屏幕高度:' + this.screenHeight);
						console.log('竖直滚动位置' + scrollTop);
						console.log('节点离页面顶部的距离为' + data.top);
						console.log('节点高度为' + data.height);
						console.log('窗口高度为' + this.windowHeight);

						uni.pageScrollTo({
							scrollTop: scrollTop - (this.windowHeight - (data.height + data.top + 45)), //一顿乱算
							// scrollTop: 50,
							duration: 300
						});
					}).exec();
				})
				.exec();
		},
		reply(index, comment_index) {
			this.is_reply = true; //回复中
			this.showInput = true; //调起input框
			let replyTo = this.posts[index].comments.comment[comment_index].username;
			this.input_placeholder = '回复' + replyTo;
			this.index = index; //post索引
			this.comment_index = comment_index; //评论索引
			this.focus = true;
		},
		blur: function() {
			this.init_input();
		},
		send_comment: function(message) {
			if (this.is_reply) {
				var reply_username = this.posts[this.index].comments.comment[this.comment_index].username;
				var comment_content = '回复' + reply_username + ':' + message.content;
			} else {
				var comment_content = message.content;
			}
			this.posts[this.index].comments.total += 1;
			this.posts[this.index].comments.comment.push({
				uid: this.user_id,
				username: this.username,
				content: comment_content //直接获取input中的值
			});
			this.init_input();
		},
		init_input() {
			this.showInput = false;
			this.focus = false;
			this.input_placeholder = '评论';
			this.is_reply = false;
		},
		previewImage(image, image_index) {
			let imgs = [];
			for (let i = 0; i < image.length; i++) {
				imgs.push(image[image_index].pic);
			}
			let current = image[image_index].pic;
			console.log(current);
			uni.previewImage({
				current: current,
				urls: imgs
			});
		},
		onShareAppMessage: function(ops) {
			if (ops.from === 'button') {
				// 来自页面内转发按钮
				console.log(ops.target);
			}
			return {
				title: this.wxTit,
				path: 'pages/tabBar/home',
				imageUrl: this.imageUrl,
				success: function(res) {
					// 转发成功
					console.log('转发成功:' + JSON.stringify(res));
				},
				fail: function(res) {
					// 转发失败
					console.log('转发失败:' + JSON.stringify(res));
				}
			};
		},
		fffx() {
		}
	}
};
</script>

<style scoped lang="scss">
@import url('../../common/index/index.css');
.banner {
	position: relative;
}
.banner image {
	width: 100%;
	height: 420upx;
}
.post-left {
	display: flex;
	align-items: center;
}
.jianB {
	position: absolute;
	bottom: -48upx;
	left: 30upx;
	width: 690upx;
	height: 126upx;
	z-index: 20;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0upx 3upx 23upx 1upx rgba(0, 0, 0, 0.05);
	border-radius: 10upx;
	display: flex;
	align-items: center;
	image {
		width: 73upx;
		height: 73upx;
		margin-left: 30upx;
		margin-right: 60upx;
	}
}
.post_header {
	width: 82upx;
}
.comment {
	display: inline-block;
	padding: 0;
	margin: 0;
	border: 1px solid #fff;
	background-color: transparent;
	outline: none;
}
.img-title {
	// width: 150upx;
	// height: 150upx;
	margin-right: 15upx;
}
.img-title image {
	width: 180upx;
	height: 190upx;
	border-radius: 8upx;
}
.be-good-at {
	color: #cfb789;
	font-size: 28upx;
}
.item {
	padding-bottom: 10upx;
	border-bottom: #cccccc 1px solid;
}
.body {
	margin-left: 40upx;
}
.price {
	color: #cfb789;
	font-size: 24upx;
}
.grace-news-list .desc {
	font-size: 26upx;
	// overflow: hidden;
	// text-overflow: ellipsis;
	// white-space: nowrap;
}
.Result {
	display: flex;
	color: #d8b57f;
}
.hui {
	filter: grayscale(100%);
	color: #999;
}
.jin {
	color: #d8b57f;
}
</style>
