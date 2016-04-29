            routerApp.directive('accordion', [function () {
                    return {
                        restrict: 'E',
                        replace:true,
                        transclude:true,
                        scope:{

                        },
                        controller:function($scope,$element){
                            var activePanel=null;
                            this.openPanel=function(panel){
                                if(this.activePanel!=null){
                                    if(panel.active){
                                        this.activePanel.active=false;
                                        this.activePanel=null;
                                        panel.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_more_18px.svg';
                                    }else{
                                        this.activePanel.active=false;
                                        this.activePanel.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_more_18px.svg';
                                        this.activePanel=panel;
                                        this.activePanel.active=true;
                                        panel.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_less_18px.svg';	
                                    }
                                }else{
                                    this.activePanel=panel;
                                    this.activePanel.active=true;
                                    panel.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_less_18px.svg';
                                }
                            }

                        },
                        template:'<div class="accordion" ng-transclude></div>',
                        link: function (scope, element, attrs) {
                        }
                    };
                }])
            
            routerApp.directive('accordionPanel', [function () {
                    return {
                        require: '^accordion',
                        restrict: 'E',
                        transclude:true,
                        replace:true,
                        scope:{
                            title:'@'
                        },
                        template:'<section class="accordion-panel">'+
                                    '<md-button ng-click="toggle();">'+
                                    '<div flex="" layout="row">'+
                                    '<span class="accordion-panel-title">{{title}}</span>'+
                                    '<span flex=""></span>'+
                                    '<span ng-if="childNodes > 0"><md-icon md-svg-src="{{icon}}"></md-icon></span></div>'+
                                    '</md-button>'+
                                    '<md-content class="md-padding animate-show" ng-show="active" ng-transclude></md-content>'+
                                '</section>',
                        link: function (scope, element, attrs, accordionCtrl) {
                            var elem=element[0];
                            elem.id='panel_'+scope.$id;
                            
                            scope.childNodes=document.querySelector("#"+elem.id+" md-content").children.length;

                            scope.icon='bower_components/material-design-icons/navigation/svg/production/ic_expand_more_18px.svg';
                            scope.active=false;
                            scope.title=scope.title;

                            scope.toggle=function(){
                                accordionCtrl.openPanel(scope);
                            }
                        }
                    };
                }])