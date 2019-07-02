<template>
	<view>
		<view class="items">
			<text>标题</text>
			<text>{{ details.productName }}</text>
		</view>
		<view class="items">
			<text>描述</text>
			<text>{{ details.productIntroduce }}</text>
		</view>
		<view class="items">
			<text>鉴定类别</text>
			<text>{{ details.jianbaoType }}</text>
		</view>
		<view class="items">图片</view>
		<view class="dimg">
			<view v-for="(item, index) in details.opics" :key="index"><image :src="item.pic" mode=""></image></view>
		</view>
		<view class="Result">鉴定结果</view>
		<view class="">
			<view class="type" v-if="details.isReal == null && details.payStatus == 2 && details.appraisalStatus == 0"><text>鉴定中</text></view>
			<view class="type" v-if="details.isReal == null && details.payStatus == 1"><text>未发布</text></view>
			<view class="type" v-if="details.isReal == 1" :class="{ jin: details.isReal == 1 }"><text>真品</text></view>
			<view class="type" v-if="details.isReal == 2"><text>赝品</text></view>
			<view class="type" v-if="details.isReal == 3" :class="{ hui: details.isReal == 3 }"><text>存疑</text></view>
		</view>
		<view class="Result">专家评价</view>
		<view class="expertComment">{{ details.expertComment }}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			details: []
		};
	},

	onLoad() {
		let _this = this;
		uni.getStorage({
			key: 'details',
			success: function(res) {
				console.log(res.data);
				_this.details = res.data;
			}
		});
	},
	methods: {}
};
</script>

<style>
.items {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 30upx;
	height: 90upx;
	line-height: 90upx;
	border-bottom: 1upx solid #e6e6e6;
}
.items text {
	font-size: 32upx;
}
.dimg {
	padding: 0 30upx;
	display: flex;
}
.dimg image {
	width: 220upx;
	height: 220upx;
	margin: 10upx;
}
.type {
	padding: 0 30upx;
	font-size: 34upx;
	/* 	text-align: right; */
}
.type text {
	/* border-bottom: 8upx solid #e6e6e6; */
}
.expertComment {
	padding: 0 30upx;
	font-size: 30upx;
}
.Result {
	padding-left: 20upx;
	margin: 40upx 0 40upx 30upx;
	border-left: #cfb789 10upx solid;
	font-size: 32upx;
}
.hui {
	filter: grayscale(100%);
	color: #999;
}
.jin {
	color: #d8b57f;
}
</style>
