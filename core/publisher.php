<?php

	class Publisher {

		private $appKey;
		private $tempPath;
		private $resPath;
		private $tenants;

		public function Publish(){
			if (!file_exists($this->resPath))
				mkdir($this->resPath, 0777, true);

			$appFile = "$this->tempPath/app.json";
			$descFile = "$this->tempPath/descriptor.json";
			
			$descriptor = $this->getDescriptor();
			$settings = $this->getSettings();
			$appObject = $this->getProject($descriptor);

			
			switch ($settings->type){
				case "wfactivity":
					$this->publishActivity($settings);
					break;
				default:
					file_put_contents($appFile, json_encode($appObject));
					file_put_contents($descFile, json_encode($settings));

					$wsPath = STORAGE_LOCATION . "/$this->appKey";
					recurse_copy($wsPath, $this->resPath);

					$iconFile = APPICON_PATH . "/$this->appKey.png";
					copy($iconFile, "$this->tempPath/icon.png");

					$zipName = TEMP_PATH."/". "publish_$this->appKey.zip";
					zip($this->tempPath,  $zipName);

					recurse_rmdir($this->tempPath);
					$this->postZip($zipName);
					break;
			}

		}

		private function publishActivity($desc){
			$codePath = STORAGE_LOCATION . "/$this->appKey/templete.go";
			$codeData =  file_get_contents($codePath);

			$postData = new stdClass();
			$postData->ID = $this->appKey;
			$postData->ActivityName = $desc->data->activityName;
			$postData->Description = $desc->data->activityDescription;
			$postData->GoCode = $codeData;

		    $ch = curl_init();
			curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
			curl_setopt($ch, CURLOPT_POST,1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData)); 
		    curl_setopt($ch, CURLOPT_URL, SVC_SMOOTHFLOW_URL . "/processengine/PublishActivity/$postData->ActivityName/$this->appKey");
		    $data = curl_exec($ch);
		    echo $data;
		    curl_close($ch);
		}

		private function getDescriptor(){
			$client = ObjectStoreClient::WithNamespace("duoworld.duoweb.info","projects","123");
			$oneProject = $client->get()->byKey($this->appKey);
			return $oneProject;
		}

		private function getProject($oneProject){

			$appObj = new stdClass();
			$appObj->ApplicationID = $oneProject->appKey;
			$appObj->SecretKey = $oneProject->secretKey;
			$appObj->Name = $oneProject->name;
			$appObj->Description = $oneProject->description;
			$appObj->AppType = $oneProject->type;
			$appObj->AppUri = "//";
			$appObj->ImageId = "";
			$appObj->iconUrl = "/apps/$oneProject->appKey/?meta=icon";
			return $appObj;
		}

		private function getSettings(){
			$client = ObjectStoreClient::WithNamespace("duoworld.duoweb.info","projectsettings","123");
			$oneProject = $client->get()->byKey($this->appKey);
			return $oneProject;
		}

		private function postZip($zipName){
			$zipContents = file_get_contents($zipName);

			foreach ($this->tenants as $tenant){
			    $ch = curl_init();

				curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
				curl_setopt($ch, CURLOPT_POST,1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $zipContents); 
				curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: $tenant", "AppKey: $this->appKey")); 
			    curl_setopt($ch, CURLOPT_URL, (strcmp($_SERVER["HTTP_HOST"], "localhost") ==0? "http://localhost/apps/" : "http://$tenant/apps/"));
			    $data = curl_exec($ch);
			    //echo $data;
			    curl_close($ch);
				
			}
		}

		function __construct($appKey, $tenants){
			$this->tenants = $tenants;
			$this->appKey = $appKey;
			$this->tempPath = TEMP_PATH . "/publish_$appKey";
			$this->resPath = "$this->tempPath/resources";
		}
	}


?>