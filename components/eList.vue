<template>
	<view class="content">
		<view>
			<view class="grace-margin">
				<view class="grace-news-list" style="margin-top:10px;">
					<view class="item" v-for="(item, index) in expertList" :key="index" @tap="expertClick(item)">
						<view class="img-title"><image :src="item.icon"></image></view>
						<view class="body">
							<view style="display: flex; justify-content: space-between; align-items: center;" class="">
								<view class="title" style="font-weight: bold;">{{ item.expertName }}</view>
								<!-- <view class="price">咨询价格￥{{ item.price }}</view> -->
							</view>
							<view class="desc">简介:{{ item.expertIntro }}</view>
							<view class="be-good-at">擅长:{{ item.expertClumn }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: 'Hello',
			expertList: []
		};
	},
	onLoad() {
		let _this = this;
		this.$ajax
			.get({
				url: '/user/listMaster?status=0&masterId=0&pageNum=0&pageSize=0'
			})
			.then(res => {
				_this.expertList = res.data.data;
				// console.log(_this.actions);
			});
	},
	methods: {}
};
</script>

<style>
.img-title {
	width: 150upx;
	height: 150upx;
	margin-right: 15upx;
}
.img-title image {
	width: 150upx;
	height: 150upx;
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
	font-size: 32upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
