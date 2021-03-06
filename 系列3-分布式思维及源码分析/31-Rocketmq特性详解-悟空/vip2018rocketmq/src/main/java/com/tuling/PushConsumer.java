package com.tuling;

import org.apache.rocketmq.client.consumer.DefaultMQPushConsumer;
import org.apache.rocketmq.client.consumer.listener.ConsumeConcurrentlyStatus;
import org.apache.rocketmq.client.consumer.listener.MessageListenerConcurrently;
import org.apache.rocketmq.common.consumer.ConsumeFromWhere;
import org.apache.rocketmq.common.message.MessageExt;
import org.apache.rocketmq.common.protocol.heartbeat.MessageModel;

import java.util.UUID;

public class PushConsumer {
    public static void main(String[] args) throws Exception {
        //生成Consumer
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("con_group_1");
        //配置Consumer
        consumer.setInstanceName(UUID.randomUUID().toString());
        consumer.setMessageModel(MessageModel.BROADCASTING);
        consumer.setConsumeMessageBatchMaxSize(32);
        consumer.setNamesrvAddr("192.168.0.12:9876;192.168.0.13:9876");
        consumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_FIRST_OFFSET);
        //consumer.registerMessageListener();
        //启动Consumer
        consumer.subscribe("qch_20170706", "*");
        consumer.start();
        //停止Consumer
        Thread.sleep(60000);
        consumer.shutdown();
    }
}
