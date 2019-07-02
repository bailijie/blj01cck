<template>
	<view>
		<button type="primary" @click="show()">切换</button>

		<unik-modal 
			ref="unikModal"
			:modalTitle="modalTitle"
			@confirmModal="confirmModal"
			@cancelModal="cancelModal"
			>
			欢迎光临
		</unik-modal>
	</view>
</template>

<script>
	import unikModal from '../components/unik-modal/unik-modal.vue'
	export default {
		data() {
			return {
				modalTitle: '标题'
			};
		},
		components: {
			unikModal
		},
		methods: {
			show () {
				this.$refs.unikModal.show()
			},
			confirmModal () {
				console.log("您点击了提交");
			},
			cancelModal() {
				console.log("您点击了关闭");
			}
		}
	}
</script>

<style>

</style>
