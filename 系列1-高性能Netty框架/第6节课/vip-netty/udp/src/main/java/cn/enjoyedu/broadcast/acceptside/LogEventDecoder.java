package cn.enjoyedu.broadcast.acceptside;

import cn.enjoyedu.broadcast.LogMsg;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.socket.DatagramPacket;
import io.netty.handler.codec.MessageToMessageDecoder;
import io.netty.util.CharsetUtil;

import java.util.List;

/**
 * @author Mark老师   享学课堂 https://enjoy.ke.qq.com
 * 往期课程和VIP课程咨询 依娜老师  QQ：2133576719
 * 类说明：解码，将DatagramPacket解码为实际的日志实体类
 */
public class LogEventDecoder extends MessageToMessageDecoder<DatagramPacket> {

    @Override
    protected void decode(ChannelHandlerContext ctx,
                          DatagramPacket datagramPacket, List<Object> out)
        throws Exception {
        //获取对 DatagramPacket 中的数据（ByteBuf）的引用
        ByteBuf data = datagramPacket.content();
        long sendTime = data.readLong();
        System.out.println("接受到"+sendTime+"发送的消息");
        long msgId = data.readLong();
        byte sepa = data.readByte();
        //获取该 SEPARATOR 的索引
        int idx = data.readerIndex();
        //提取日志消息
        String sendMsg = data.slice(idx ,
            data.readableBytes()).toString(CharsetUtil.UTF_8);
        //构建一个新的 LogMsg 对象，并且将它添加到（已经解码的消息的）列表中
        LogMsg event = new LogMsg(datagramPacket.sender(),
                msgId, sendMsg);
        out.add(event);
    }
}
