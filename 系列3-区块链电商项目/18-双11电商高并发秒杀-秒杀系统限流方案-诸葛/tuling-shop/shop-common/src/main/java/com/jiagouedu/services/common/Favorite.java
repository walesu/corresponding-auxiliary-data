package com.jiagouedu.services.common;import com.jiagouedu.core.dao.page.PagerModel;import java.io.Serializable;public class Favorite extends PagerModel implements Serializable {	private static final long serialVersionUID = 1L;	private String id;	private String account;	private String productID;	private String createtime;		private Product product;	public void clear() {		super.clear();		id = null;		account = null;		productID = null;		createtime = null;		if(product!=null){			product.clear();		}	}	public String getId() {		return id;	}	public void setId(String id) {		this.id = id;	}	public String getAccount() {		return account;	}	public void setAccount(String account) {		this.account = account;	}	public String getProductID() {		return productID;	}	public void setProductID(String productID) {		this.productID = productID;	}	public String getCreatetime() {		return createtime;	}	public void setCreatetime(String createtime) {		this.createtime = createtime;	}	public Product getProduct() {		return product;	}	public void setProduct(Product product) {		this.product = product;	}	}