var servicesFactory = angular.module("servicesFactory",['ionic']);

servicesFactory.factory('checklocalimg', function(){
	return function checklocalimg(callback){
			//选择本地图片
			var fileinput;
			if(!document.getElementById('fileImg')){
				fileinput=document.createElement("input");
				fileinput.id='fileImg';
				fileinput.type='file';
				fileinput.accept="image/*";
				document.body.appendChild(fileinput);
			}else{
				fileinput=document.getElementById('fileImg');
			}
			fileinput.addEventListener('change', handleFileSelect, false);
			fileinput.click();
			function handleFileSelect (evt) {
				fileinput.removeEventListener('change', handleFileSelect, false);
				var file = evt.target.files[0];
				if (!file.type.match('image.*')){
					return;
				}
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload=function(e){
					console.log(e.target.result);
					var img=new Image();
					img.src=e.target.result;
					callback(img);
				};
			}

	};
})

;