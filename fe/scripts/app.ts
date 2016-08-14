import * as angular from 'angular'
import {Guest, Host} from './communicators.ts'

angular.module("app", [])
.controller("main", function($scope) {
    $scope.userId = Math.floor(Math.random() * Date.now())
    $scope.connectedUsers = []
    $scope.messages = []
    $scope.a = {}
    $scope.a.messageText = ""
    $scope.textSubmit = () => {
        push({"text": $scope.a.messageText})
        receiveMessage({"text": $scope.a.messageText, "userId": "me"})
        $scope.a.messageText = ""
    }
    
    let push = function(message) {
        message.userId = $scope.userId
        ws.send(JSON.stringify(message))
    }
    
    let receiveMessage =  function (data) {
        $scope.messages.push(data)
    }

    let connectUser = function (data) {
        if ($scope.connectedUsers.includes(data.userId)) {
            return
        }
        $scope.connectedUsers.push(data.userId)
        $scope.$apply()
    }

    let ws = new WebSocket(window['WEBSOCKETS_URL'])
    ws.onopen = function() {
        push({"hello": true})
    }
    ws.onmessage = function(message) {
        let data = JSON.parse(message.data)
        
        if (data.userId == $scope.userId) {
            return
        }
        if (data.hello) {
            connectUser(data)
            if (!$scope.cham) {
                $scope.cham = new Host(push)
                $scope.cham.createChannel("channel")
            }
            push({"helloBack": true})
        }
        if (data.helloBack) {
            if (!$scope.cham) {
                $scope.cham = new Guest(push)
            }
            connectUser(data)
        }
        if (data.sdp && $scope.cham.createAnswer) {
            $scope.cham.createAnswer(data.sdp)
        }
        if (data.candidate) {
            $scope.cham.addIceCandidate(data.candidate)
        }
        if (data.text) {
            receiveMessage(data)
            $scope.$apply()
        }
    }
})