package com.jiagouedu.services.front.product;import com.jiagouedu.core.Services;import com.jiagouedu.services.front.product.bean.Product;import com.jiagouedu.services.front.product.bean.ProductStockInfo;import java.util.List;public interface ProductService extends Services<Product> {	/**	 * 商品上架	 * @param ids	 */	void upGoods(String[] ids);		/**	 * 商品下架	 * @param ids	 */	void downGoods(String[] ids);	/**	 * 根据商品关键字搜索商品列表	 * @param key	 * @return	 */	List<Product> search(Product e);	/**	 * 查询商品参数列表	 * @param id	 * @return	 */	List<Product> selectParameterList(String id);	/**	 * 加载商品库存列表	 * @param product	 * @return	 */	List<ProductStockInfo> selectStockList(Product product);		/**	 * 加载商品介绍信息	 * @param product	 * @return	 */	List<Product> selectListProductHTML(Product product);		/**	 * 根据商品ID集合加载商品信息	 * @param p	 * @return	 */	List<Product> selectProductListByIds(Product p);	/**	 * 查询热门搜索的商品	 * @param list	 * @return	 */	List<Product> selectHotSearch(Product p);	/**	 * 加载热卖商品列表，此数据将会在门户的超级菜单上显示出来。 	 * @param product	 * @return	 */	List<Product> loadHotProductShowInSuperMenu(Product product);	/**	 * 更新商品的浏览次数	 * @param p	 */	void updateHit(Product p);	/**	 * 加载页面左侧商品列表	 * @param p	 * @return	 */	List<Product> selectPageLeftHotProducts(Product p);	/**	 * 加载促销活动的商品	 * @return	 */	List<Product> selectActivityProductList(Product p);}