/**
 * Created by AilenZou on 2016/10/21.
 */

"use strict";

require("./style/image.less");

var app = angular.module("angular.easy.input", [])
    .directive("ngImageInput", function() {
        return {
            scope: {
                src: "=ngModel",
                upload: "=",
                srcToUrl: "=",
                hwRatio: "="
            },
            require: ["ngModel", "^form"],
            restrict: "E",
            template: require("./v/image-input.html"),
            link: function($scope, element, attributes, controllers) {
                console.log("in imageInput");
                console.log(element);
                $scope.status = "normal";
                $scope.$watch("hwRatio", function(val) {
                    if (val && +val) {
                        $scope.size = {
                            "padding-bottom": "" + ((+val) * 100) + "%"
                        };
                    }
                });
                $scope.$watch("src", function(newVal, oldVal) {
                    $scope.preview = $scope.srcToUrl && $scope.srcToUrl(newVal) ||
                        function (src) {
                            return src;
                        }(newVal);
                });
                $scope.class = function() {
                    var classes = [$scope.status];
                    return classes;
                };
                $("input", element).change(function(e) {
                    var file = (this.files && this.files[0]) || undefined;
                    if (file) {
                        var reader = new FileReader();
                        $scope.status = "uploading";
                        reader.onload = function(e) {
                            $scope.$apply(function () {
                                $scope.preview = e.target.result;
                            });
                            if ($scope.upload) {
                                $scope.upload(file)
                                    .then(function(val) {
                                        $scope.src = val;
                                        $scope.status = "success";
                                    })
                                    .catch(function() {
                                        $scope.status = "failed";
                                    })
                                ;
                            } else {
                                $scope.status = "failed";
                                $("input", element).val("");
                            }
                        };
                        reader.onerror = function(e) {
                            $scope.status = "failed";
                            $("input", element).val("");
                        };
                        reader.readAsDataURL(this.files[0]);
                    }
                });
            }
        };
    })
;

module.exports = app;
