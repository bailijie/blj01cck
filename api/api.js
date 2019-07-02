// const baseUrl = "https://192.168.0.120:8087";
// const baseUrl = "https://192.168.0.112:8087";
// const baseUrl = "https://192.168.0.162:8087";
const baseUrl = "https://jianbao.mumonline.net/jianbao";
// header:{'Content-Type':'application/json'},
// header:{'Content-Type':'application/x-www-form-urlencoded'},
const $ajax = {
		get: function({
			url,
			param,
			header
		}) {
			return new Promise(function(resolve, reject) {
				uni.request({
					url: baseUrl + url,
					data: param,
					method: "GET",
					success: function(res) {
						if (res.statusCode !== 200) {
							reject(res)
						} else {
							resolve(res);
						}
					},
					fail: function(err) {
						reject(err)
					}
				})
			})
		},
		post: function({
			url,
			data,
			header
		}) {
			return new Promise(function(resolve, reject) {
				uni.request({
					url: baseUrl + url,
					data: data,
					method: "POST",
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.statusCode !== 200) {
							reject(res)
						} else {
							resolve(res);
						}
					},
					fail: function(err) {
						reject(err)
					}
				})
			})
		},
		postJSON: function({
			url,
			data,
			header
		}) {
			return new Promise(function(resolve, reject) {
				uni.request({
					url: baseUrl + url,
					data: data,
					method: "POST",
					header: {
						'Content-Type': 'application/json;charset=UTF-8'
					},
					success: function(res) {
						if (res.statusCode !== 200) {
							reject(res)
						} else {
							resolve(res);
						}
					},
					fail: function(err) {
						reject(err)
					}
				})
			})
		}
// 		upImg: function({
// 			url,
// 			imgUrl
// 		}) {
// 			return new Promise(function(resolve, reject) {
// 				uni.uploadFile({
// 					url: "https://jianbao.mumonline.net/jianbao" + url,
// 					filePath: imgUrl,
// 					name: 'file',
// 					success: function(uploadFileRes) {
// 						resolve(uploadFileRes);
// 					},
// 
// 					fail: function(err) {
// 						reject(err)
// 					}
// 				});
// 			})
		}
		export default $ajax
