package com.jiagouedu.services.front.favorite.bean;import com.jiagouedu.services.front.product.bean.Product;import java.io.Serializable;public class Favorite extends com.jiagouedu.services.common.Favorite implements Serializable {	private static final long serialVersionUID = 1L;	private Product product;	public void clear() {		super.clear();		if(product!=null){			product.clear();		}	}	public Product getProduct() {		return product;	}	public void setProduct(Product product) {		this.product = product;	}	}