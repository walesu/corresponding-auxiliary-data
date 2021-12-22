package com.jiagouedu.web.action.front.cart;import com.alibaba.fastjson.JSON;import com.jiagouedu.core.FrontContainer;import com.jiagouedu.core.Services;import com.jiagouedu.core.front.SystemManager;import com.jiagouedu.services.front.account.bean.Account;import com.jiagouedu.services.front.address.AddressService;import com.jiagouedu.services.front.product.ProductService;import com.jiagouedu.services.front.product.bean.Product;import com.jiagouedu.services.front.product.bean.ProductStockInfo;import com.jiagouedu.services.manage.activity.bean.Activity;import com.jiagouedu.services.manage.spec.SpecService;import com.jiagouedu.services.manage.spec.bean.Spec;import com.jiagouedu.web.action.front.FrontBaseController;import com.jiagouedu.web.action.front.orders.CartInfo;import com.jiagouedu.web.util.RequestHolder;import org.apache.commons.lang.StringUtils;import org.slf4j.Logger;import org.slf4j.LoggerFactory;import org.springframework.beans.factory.annotation.Autowired;import org.springframework.stereotype.Controller;import org.springframework.ui.ModelMap;import org.springframework.web.bind.annotation.RequestMapping;import org.springframework.web.bind.annotation.RequestMethod;import org.springframework.web.bind.annotation.ResponseBody;import javax.servlet.http.HttpServletRequest;import java.io.IOException;import java.text.DecimalFormat;import java.util.ArrayList;import java.util.Iterator;import java.util.LinkedList;import java.util.List;/** * 购物车 *  * @author wukong 图灵学院 QQ:245553999 *  */@Controller("frontCartAction")@RequestMapping("cart")public class CartAction extends FrontBaseController<CartInfo> {	private static final long serialVersionUID = 1L;	private static final Logger logger = LoggerFactory.getLogger(CartAction.class);	@Autowired	private ProductService productService;	@Autowired	private AddressService addressService;	@Autowired	private SpecService specService;	@Override	public Services<CartInfo> getService() {		return null;	}	/**	 * 查看购物车	 * @return	 */	@RequestMapping("cart")	public String cart(ModelMap model){		logger.error("AccountAction.cart查看购物车...");//		Account acc = (Account) getSession().getAttribute(FrontContainer.USER_INFO);//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {//			return "toLogin";//		}		List<Product> productList = new ArrayList<Product>();		CartInfo cartInfo = getMyCart();		if(cartInfo!=null){			productList = cartInfo.getProductList();		} else {			cartInfo = new CartInfo();		}		model.addAttribute("cartInfo", cartInfo);		model.addAttribute("productList", productList);		return "cart";		//		String addCart = getRequest().getParameter("addCart");//		CartInfo cartInfo = (CartInfo) getSession().getAttribute(FrontContainer.myCart);//		if(cartInfo==null){//			cartInfo = new CartInfo();//		}//		getSession().setAttribute(FrontContainer.myCart,cartInfo);//		logger.error("===addCart="+(addCart!=null && addCart.equals("1")));//		if(addCart!=null && addCart.equals("1")){//			String productID = getE().getId();//			if(StringUtils.isEmpty(productID)){//				//查询购物车//				return "cart";//			}//			//			if(cartInfo==null){//				cartInfo = new CartInfo();//				getSession().setAttribute(FrontContainer.myCart, cartInfo);//			}//			int inputBuyNum = Integer.valueOf(getRequest().getParameter("inputBuyNum"));//			if(inputBuyNum<=0){//				throw new NullPointerException();//			}//			//检查指定的产品是否已购买到购物车，购买了则数量++，否则查询后添加到购物车//			boolean exists = false;//			for(int i=0;i<cartInfo.getProductList().size();i++){//				Product p = cartInfo.getProductList().get(i);//				if(p.getId().equals(productID)){//					p.setBuyCount(p.getBuyCount()+inputBuyNum);//					exists = true;//				}//			}//			if(!exists){//				//添加产品到购物车//				System.out.println("id="+productID);////				getE().clear();//				Product pp = new Product();//				pp.setId(productID);//				pp.setStatus(1);//				pp = productService.selectOne(pp);//				if(pp==null){//					throw new NullPointerException("根据商品ID="+productID+"查询不到指定的商品信息。");//				}//				pp.setBuyCount(inputBuyNum);//				//				cartInfo.getProductList().add(pp);//			}//			cartInfo.setAmount(cartInfo.cacl());//			getE().clear();//			//		}//		//		//加载配送信息//		Address add = new Address();//		add.setAccount(acc.getAccount());//		List<Address> addressList = addressService.selectList(add);//		cartInfo.setAddressList(addressList);//		if(addressList!=null && addressList.size()>0){////			boolean exist = false;//			for(int i=0;i<addressList.size();i++){//				Address addItem = addressList.get(i);//				if(StringUtils.isNotBlank(addItem.getIsdefault()) && addItem.getIsdefault().equals("y")){//					cartInfo.setDefaultAddessID(addItem.getId());//					break;//				}//			}//		}//		logger.error("cartInfo="+cartInfo);//		return "cart";	}		/**	 * 从购物车中删除指定的产品	 * @return	 */	@RequestMapping(value = "delete", method = RequestMethod.POST)	public String delete(ModelMap model, String id){		if(StringUtils.isBlank(id)){			throw new NullPointerException("非法请求！");		}				CartInfo cartInfo = getMyCart();		if(cartInfo==null){			//会话超时，转到登陆页面			return page_toLoginRedirect;		}				for(Iterator<Product> it = cartInfo.getProductList().iterator(); it.hasNext();){			Product p = it.next();			if(p.getId().equals(id)){				it.remove();								//重新计算总支付金额//				cartInfo.setAmount(cartInfo.totalCacl());				cartInfo.totalCacl();				break;			}		}		return "redirect:/cart/cart.html";	}	DecimalFormat df = new DecimalFormat("0.00");	/**	 * 加入购物车，不对金额进行任何的运算。金额的运算在方法CartAction.notifyCart	 * @return	 * @throws IOException 	 */	@RequestMapping("addToCart")	@ResponseBody	public String addToCart(ModelMap model) throws IOException{//		Account acc = (Account) getSession().getAttribute(FrontContainer.USER_INFO);//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {//			super.write("1");//需要登录//			return null;//		}				logger.info("ProductAction.cart...");		HttpServletRequest request = RequestHolder.getRequest();		String productID = request.getParameter("productID");//商品ID		int buyCount = Integer.valueOf(request.getParameter("buyCount"));//购买数量		String buySpecID = request.getParameter("buySpecID");//选中的规格ID		if(StringUtils.isEmpty(productID) || buyCount<=0){			throw new NullPointerException("参数错误！");		}				/**		 * 检查内存库存是否已超卖，如果超库存不足，则提醒用户		 */		ProductStockInfo momeryStockInfo = SystemManager.getInstance().getProductStockMap().get(productID);		if(momeryStockInfo==null){			String jsonError = JSON.toJSONString(new StockErrorProduct(productID,"很抱歉，商品已下架暂时无法购买！"));			logger.info("jsonError=" + jsonError);			return (jsonError);		}						CartInfo cartInfo = getMyCart();		if(cartInfo==null){			cartInfo = new CartInfo();		}		RequestHolder.getSession().setAttribute(FrontContainer.myCart, cartInfo);				//检查指定的产品是否已购买到购物车，购买了则数量++，否则查询后添加到购物车		boolean exists = false;		for(int i=0;i<cartInfo.getProductList().size();i++){			Product p = cartInfo.getProductList().get(i);			if(p.getId().equals(productID)){				p.setBuyCount(p.getBuyCount()+buyCount);				logger.info("商品已购买，只对数量进行++，总数=" + p.getBuyCount());								if(p.getExchangeScore() > 0){					p.setTotal0("0.00");					p.setTotalExchangeScore(p.getBuyCount() * p.getExchangeScore());				}else{					p.setTotal0(df.format(p.getBuyCount() * Double.valueOf(p.getNowPrice())));				}				exists = true;			}		}				//如果购物车中部存在此商品，则添加到购物车		if(!exists){			Product product = new Product();			product.setId(productID);//			product.setStatus(1);			product = productService.selectOne(product);			if(product==null){				throw new NullPointerException();			}						/**			 * 如果此商品为促销活动的商品，则按照活动规则计算商品金额			 */			if(StringUtils.isNotBlank(product.getActivityID())){				Activity activity = SystemManager.getInstance().getActivityMap().get(product.getActivityID());				if(activity==null){					String jsonError = JSON.toJSONString(new StockErrorProduct(productID,"活动可能已下架！"));					logger.error("jsonError="+jsonError);					return (jsonError);//活动可能已下架!				}else if(activity.checkActivity()){					String jsonError = JSON.toJSONString(new StockErrorProduct(productID,"活动已结束！"));					logger.error("jsonError="+jsonError);					return (jsonError);//活动已结束！				}								//检查是否符合此活动的会员等级范围				Account acc = getLoginAccount();				if(acc==null){					String jsonError = JSON.toJSONString(new StockErrorProduct(productID,"此商品为促销活动的商品，请先登陆才能购买！！"));					logger.error("jsonError="+jsonError);					return (jsonError);				}				logger.error("acc.getRank() = " + acc.getRank());				logger.error("activity.getAccountRange() = " + activity.getAccountRange());								if(activity.getAccountRange().indexOf(acc.getRank()) < 0){					String jsonError = JSON.toJSONString(new StockErrorProduct(productID,"您的会员等级不在此活动的购买范围内！"));					logger.error("jsonError="+jsonError);					return (jsonError);				}								//计算活动商品的最终结算价				product.setNowPrice(product.caclFinalPrice());								//判断如果是积分商品，则计算所需的积分				if(activity.getActivityType().equals(Activity.activity_activityType_j)){					product.setExchangeScore(activity.getExchangeScore());				}			}						product.setBuyCount(buyCount);						/**			 * 加载指定商品的规格信息			 */			if(StringUtils.isNotBlank(buySpecID)){				Spec spec = specService.selectById(buySpecID);				if(spec==null){					throw new NullPointerException("根据指定的规格"+buySpecID+"查询不到任何数据!");				}				product.setBuySpecInfo(spec);								//减少以后的逻辑判断，规格的价格等同于商品的价格				product.setNowPrice(spec.getSpecPrice());			}						if(product.getExchangeScore()==0){				product.setTotal0(df.format(product.getBuyCount() * Double.valueOf(product.getNowPrice())));			}else{				product.setTotalExchangeScore(product.getBuyCount() * product.getExchangeScore());				product.setTotal0("0.00");			}						cartInfo.getProductList().add(product);			logger.error("添加商品到购物车!商品ID="+product.getId());		}		cartInfo.totalCacl();//计算购物车中商品总金额//		e.clear();				return ("0");//成功添加商品到购物车	}		/**	 * 通知购物车+-商品，然后计算出总金额返回。	 * @return	 * @throws IOException 	 */	@RequestMapping(value = "notifyCart", method = RequestMethod.POST)	@ResponseBody	public String notifyCart(ModelMap model) throws IOException{		HttpServletRequest request = RequestHolder.getRequest();		int currentBuyNumber = Integer.valueOf(request.getParameter("currentBuyNumber"));//当前购买的商品的数量		String productID = request.getParameter("productID");//+-的商品ID		logger.error("currentBuyNumber="+currentBuyNumber+",productID="+productID);				if (StringUtils.isBlank(productID) || currentBuyNumber<=0) {			throw new NullPointerException("非法请求!");		}				CartInfo cartInfo = getMyCart();		if(cartInfo==null || cartInfo.getProductList()==null || cartInfo.getProductList().size()==0){			//购物车失效，转到登陆页面			return page_toLoginRedirect;		}		//		String msg = null;		CartProductInfo cartProductInfo = new CartProductInfo();				/**		 * 检查购买的商品是否超出库存数		 */		ProductStockInfo stockInfo = SystemManager.getInstance().getProductStockMap().get(productID);		if(stockInfo==null){			//商品已卖完或已下架，请联系站点管理员!			logger.error("商品已卖完或已下架，请联系站点管理员或从购物车中删除!");			cartProductInfo.code = "notThisProduct";			cartProductInfo.msg = "商品已卖完或已下架，请联系站点管理员或从购物车中删除!";			return (JSON.toJSONString(cartProductInfo));//			super.write("{\"code\":\"notThisProduct\",\"msg\":\"商品已卖完或已下架，请联系站点管理员或从购物车中删除!\"}");		} else if(StringUtils.isNotBlank(stockInfo.getActivityID())){			/**			 * 购买的是活动促销的商品，则检查是否超出购买的最大数量			 */			Activity activity = SystemManager.getInstance().getActivityMap().get(stockInfo.getActivityID());			if(activity==null || activity.getStatus().equals(Activity.activity_status_n)){				cartProductInfo.code = "buyMore";				cartProductInfo.msg = "此商品为促销活动的商品，最多只能购买" + activity.getMaxSellCount()+"件";				return (JSON.toJSONString(cartProductInfo));			}else if(activity.getMaxSellCount() != 0 && currentBuyNumber > activity.getMaxSellCount()){//				String msg0 = "此商品为促销活动的商品，最多只能购买" + activity.getMaxSellCount()+"件";//				msg = "{\"code\":\"buyMore\",\"msg\":\"" + msg0 + "\",\"maxStock\":\""+stockInfo.getStock()+"\"}";								cartProductInfo.code = "buyMore";				cartProductInfo.msg = "此商品为促销活动的商品，最多只能购买" + activity.getMaxSellCount()+"件";				return (JSON.toJSONString(cartProductInfo));			}			//			if(activity.getActivityType().equals(Activity.activity_activityType_j)){////				currentBuyNumber * activity.getExchangeScore()//				activity.sete//			}		}else{			if(stockInfo.getStock() < currentBuyNumber){				//购买的商品数超出库存数，则自动当最大库存数计算				currentBuyNumber = stockInfo.getStock();				//				String msg0 = "最多只能买"+stockInfo.getStock()+"件";//				msg = "{\"code\":\"buyMore\",\"msg\":\""+msg0+"\",\"maxStock\":\""+stockInfo.getStock()+"\"}";								cartProductInfo.code = "buyMore";				cartProductInfo.msg = "最多只能买"+stockInfo.getStock()+"件";				return (JSON.toJSONString(cartProductInfo));			}		}				/**		 * 计算出点击+-的这一个商品的一些信息：小计、所需积分		 *///		if(msg==null){			for(int i=0;i<cartInfo.getProductList().size();i++){				Product pro = cartInfo.getProductList().get(i);				if(pro.getId().equals(productID)){					pro.setBuyCount(currentBuyNumber);//设置指定商品购买的数量										cartInfo.totalCacl();//计算购物车中商品总金额					//					msg = "{\"code\":\"ok\",\"amount\":\""+cartInfo.getAmount()+"\"}";										if(pro.getExchangeScore()==0){						pro.setTotal0(df.format(Double.valueOf(pro.getNowPrice()) * pro.getBuyCount()));					}else{						pro.setTotal0("0.00");						pro.setTotalExchangeScore(pro.getBuyCount() * pro.getExchangeScore());					}										cartProductInfo.code = "ok";					cartProductInfo.total0 = pro.getTotal0();					cartProductInfo.amount = cartInfo.getAmount();					cartProductInfo.totalExchangeScore = pro.getBuyCount() * pro.getExchangeScore();					cartProductInfo.amountExchangeScore = cartInfo.getTotalExchangeScore();//					cartProductInfo.msg = "{\"code\":\"ok\",\"amount\":\""+cartInfo.getAmount()+"\"}";					break;				}			}//		}		return (JSON.toJSONString(cartProductInfo));	}		/**	 * 正式转到支付之前的最后一次检查库存	 * 此方法也可以用于批量错误消息检查，比如在购物车商品列表页面，提交到支付页面的时候进行批量检查（所有商品是否都有货、是否存在超卖、是否已下架、是否活动已结束（未在指定时间内进行支付，且活动已结束））	 * @return	 * @throws IOException 	 */	@RequestMapping("checkStockLastTime")	@ResponseBody	public String checkStockLastTime() throws IOException{				logger.error("checkStockLastTime...");		Account acc = getLoginAccount();		if(acc==null){//			throw new NullPointerException("请先登陆！");			logger.error("提示用户需要登录...");			return ("-1");//提示用户需要登录		}						StockErrorProductReturn result = new StockErrorProductReturn();		CartInfo cartInfo = getMyCart();		if(cartInfo==null){			logger.error("login..");			//session超时，转到登陆页面，让用户重新登陆下单，上次未支付的单子只能找不到了。			result.code = "login";			return (JSON.toJSONString(result).toString());		}				result.code = "result";		List<StockErrorProduct> list = new LinkedList<StockErrorProduct>();		for(int i=0;i<cartInfo.getProductList().size();i++){			Product pro = cartInfo.getProductList().get(i);			ProductStockInfo stockInfo = SystemManager.getInstance().getProductStockMap().get(pro.getId());			if(stockInfo!=null){				if(StringUtils.isNotBlank(stockInfo.getActivityID())){					/**					 * 购买的是活动促销的商品，则检查是否超出购买的最大数量					 */					Activity activity = SystemManager.getInstance().getActivityMap().get(stockInfo.getActivityID());					if(activity.getMaxSellCount() != 0 && pro.getBuyCount() > activity.getMaxSellCount()){						String msg0 = "此商品为促销活动的商品，最多只能购买" + activity.getMaxSellCount()+"件";//						msg = "{\"code\":\"buyMore\",\"msg\":\"" + msg0 + "\",\"maxStock\":\""+stockInfo.getStock()+"\"}";						list.add(new StockErrorProduct(pro.getId(),msg0));					}										//如果商品为需要积分兑换的，则检查用户账户上的积分是否足够					if(false){						acc = getLoginAccount();						if(acc==null){							throw new NullPointerException("请先登陆！");						}												//积分不足的错误提示						if(acc.getScore() < activity.getExchangeScore() * pro.getBuyCount()){							list.add(new StockErrorProduct(pro.getId(),"此商品总共所需积分："+activity.getExchangeScore() * pro.getBuyCount() + "点，可惜您目前只有"+acc.getScore()+"积分"));						}					}				}else{					if(stockInfo.getStock()<pro.getBuyCount()){						//购物车中购买的商品超出库存数						list.add(new StockErrorProduct(pro.getId(),"最多只能购买"+stockInfo.getStock()+"个！"));					}					//					if(stockInfo.getStock() < currentBuyNumber){//						//购买的商品数超出库存数，则自动当最大库存数计算//						currentBuyNumber = stockInfo.getStock();//						//						String msg0 = "最多只能买"+stockInfo.getStock()+"件";//						msg = "{\"code\":\"buyMore\",\"msg\":\""+msg0+"\",\"maxStock\":\""+stockInfo.getStock()+"\"}";//					}				}							}else{				//商品可能已经下架或售完！				list.add(new StockErrorProduct(pro.getId(),"商品可能已经下架或售完！"));			}		}				//检查积分是否足够支付此订单消耗的积分				//积分不足的错误提示		if(acc.getScore() < cartInfo.getTotalExchangeScore()){			result.error = "总共所需积分：" + cartInfo.getTotalExchangeScore() + ",可惜您仅有积分：" + acc.getScore();		}				if(list!=null && list.size()>0){			result.list = list;		}				cartInfo.totalCacl();//计算购物车中商品总金额//		logger.error("checkStockLastTime..."+JSON.toJSONString(result).toString());		return (JSON.toJSONString(result).toString());	}		/**	 * 库存检查返回的错误对象	 * @author wukong 图灵学院 QQ:245553999	 *	 */	class StockErrorProductReturn{		String code;		String error;//错误消息，显示到提交按钮边上		List<StockErrorProduct> list;				public String getCode() {			return code;		}		public void setCode(String code) {			this.code = code;		}		public List<StockErrorProduct> getList() {			return list;		}		public void setList(List<StockErrorProduct> list) {			this.list = list;		}		public String getError() {			return error;		}		public void setError(String error) {			this.error = error;		}	}		/**	 * 库存检查错误消息对象	 */	class StockErrorProduct{		String id;//商品ID		String tips;//错误消息				public StockErrorProduct(){}				public StockErrorProduct(String id,String tips){			this.id = id;			this.tips = tips;		}				public String getId() {			return id;		}				public void setId(String id) {			this.id = id;		}				public String getTips() {			return tips;		}				public void setTips(String tips) {			this.tips = tips;		}	}		/**	 * 购物车页面，单个商品返回的信息对象	 */	class CartProductInfo {		String code;//返回代码		String msg;//返回消息		String total0;//小计金额		String amount;//总计金额		int totalExchangeScore;//兑换此商品所需总积分		int amountExchangeScore;//积分汇总				public String getCode() {			return code;		}		public void setCode(String code) {			this.code = code;		}		public String getMsg() {			return msg;		}		public void setMsg(String msg) {			this.msg = msg;		}		public String getTotal0() {			return total0;		}		public void setTotal0(String total0) {			this.total0 = total0;		}		public String getAmount() {			return amount;		}		public void setAmount(String amount) {			this.amount = amount;		}		public int getTotalExchangeScore() {			return totalExchangeScore;		}		public void setTotalExchangeScore(int totalExchangeScore) {			this.totalExchangeScore = totalExchangeScore;		}		public int getAmountExchangeScore() {			return amountExchangeScore;		}		public void setAmountExchangeScore(int amountExchangeScore) {			this.amountExchangeScore = amountExchangeScore;		}			}}