package com.jiagouedu.services.front.orderlog.dao;import com.jiagouedu.core.DaoManager;import com.jiagouedu.services.front.orderlog.bean.Orderlog;/*** *  图灵学院 wukong QQ:245553999 */public interface OrderlogDao extends DaoManager<Orderlog> {	int selectCount(Orderlog orderlog);}