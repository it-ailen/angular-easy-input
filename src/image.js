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
            link: function($scope, elements, attributes, controllers) {
                console.log("in imageInput");
                console.log(elements);
                var formController = controllers[0];
                var modelController = controllers[1];
                $scope.status = "normal";
                $scope.$watch("hwRatio", function(val) {
                    if (val && +val) {
                        $scope.size = {
                            "padding-bottom": "" + ((+val) * 100) + "%"
                        };
                    }
                });
                $scope.$watch("src", function(newVal, oldVal) {
                    if (angular.isUndefined(newVal) && angular.isUndefined(oldVal)) {
                        return;
                    }
                    console.log("src changed...'" + oldVal + "'-->'" + newVal + "'");
                    $scope.preview = $scope.srcToUrl && $scope.srcToUrl(newVal) ||
                        function (src) {
                            return src;
                        }(newVal);
                    if (attributes.required && (angular.isUndefined(newVal) || newVal === null)) {
                        modelController.$setValidity("required", false);
                    } else {
                        modelController.$setValidity("required", true);
                    }
                });
                $scope.class = function() {
                    var classes = [$scope.status];
                    return classes;
                };
                console.log("element");
                console.log(elements);
                console.log(elements[0].querySelector("input"));
                var input = angular.element(elements[0].querySelector("input"));
                input.on("change", function(e) {
                    console.log("input changed now...");
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
                                        modelController.$setDirty();
                                        formController.$setDirty();
                                        modelController.$setValidity("required", false);
                                    })
                                    .catch(function(e) {
                                        $scope.status = "failed";
                                        input.val("");
                                        if (attributes.required) {
                                            modelController.$setValidity("required", false);
                                        }
                                    })
                                ;
                            } else {
                                $scope.status = "failed";
                                input.val("");
                                if (attributes.required) {
                                    modelController.$setValidity("required", false);
                                }
                            }
                        };
                        reader.onerror = function(e) {
                            $scope.status = "failed";
                            input.val("");
                        };
                        reader.readAsDataURL(this.files[0]);
                    }
                    e.preventDefault();
                    return false;
                });
            }
        };
    })
;

module.exports = app;
