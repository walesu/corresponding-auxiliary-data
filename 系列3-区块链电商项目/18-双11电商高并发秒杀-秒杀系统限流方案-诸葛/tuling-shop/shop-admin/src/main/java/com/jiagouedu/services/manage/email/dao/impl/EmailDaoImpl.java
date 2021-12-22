package com.jiagouedu.services.manage.email.dao.impl;import com.jiagouedu.core.dao.BaseDao;import com.jiagouedu.core.dao.page.PagerModel;import com.jiagouedu.services.manage.email.bean.Email;import com.jiagouedu.services.manage.email.dao.EmailDao;import org.springframework.stereotype.Repository;import javax.annotation.Resource;import java.util.List;@Repository("emailDaoManage")public class EmailDaoImpl implements EmailDao {    @Resource	private BaseDao dao;	public void setDao(BaseDao dao) {		this.dao = dao;	}	public PagerModel selectPageList(Email e) {		return dao.selectPageList("manage.email.selectPageList",				"manage.email.selectPageCount", e);	}	public List selectList(Email e) {		return dao.selectList("manage.email.selectList", e);	}	public Email selectOne(Email e) {		return (Email) dao.selectOne("manage.email.selectOne", e);	}	public int delete(Email e) {		return dao.delete("manage.email.delete", e);	}	public int update(Email e) {		return dao.update("manage.email.update", e);	}	public int deletes(String[] ids) {		Email e = new Email();		for (int i = 0; i < ids.length; i++) {			e.setId(ids[i]);			delete(e);		}		return 0;	}	public int insert(Email e) {		return dao.insert("manage.email.insert", e);	}	public int deleteById(int id) {		return dao.delete("manage.email.deleteById", id);	}	@Override	public Email selectById(String id) {		return (Email) dao.selectOne("manage.email.selectById", id);	}}