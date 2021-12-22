package com.jiagouedu.services.front.attributelink.dao.impl;import com.jiagouedu.core.dao.BaseDao;import com.jiagouedu.core.dao.page.PagerModel;import com.jiagouedu.services.front.attributelink.bean.AttributeLink;import com.jiagouedu.services.front.attributelink.dao.AttributeLinkDao;import org.springframework.stereotype.Repository;import javax.annotation.Resource;import java.util.List;@Repository("attributeLinkDaoFront")public class AttributeLinkDaoImpl implements AttributeLinkDao {    @Resource	private BaseDao dao;	public void setDao(BaseDao dao) {		this.dao = dao;	}	public PagerModel selectPageList(AttributeLink e) {		return dao.selectPageList("front.attributeLink.selectPageList",				"front.attributeLink.selectPageCount", e);	}	public List selectList(AttributeLink e) {		return dao.selectList("front.attributeLink.selectList", e);	}	public AttributeLink selectOne(AttributeLink e) {		return (AttributeLink) dao.selectOne("front.attributeLink.selectOne", e);	}	public int delete(AttributeLink e) {		return dao.delete("front.attributeLink.delete", e);	}	public int update(AttributeLink e) {		return dao.update("front.attributeLink.update", e);	}	public int deletes(String[] ids) {		AttributeLink e = new AttributeLink();		for (int i = 0; i < ids.length; i++) {			e.setId(ids[i]);			delete(e);		}		return 0;	}	public int insert(AttributeLink e) {		return dao.insert("front.attributeLink.insert", e);	}	public int deleteById(int id) {		return dao.delete("front.attributeLink.deleteById", id);	}	public int deleteByCondition(AttributeLink e) {		return dao.delete("front.attributeLink.deleteByCondition", e);	}		public AttributeLink selectById(String id) {		return (AttributeLink) dao.selectOne("account.selectById", id);	}}