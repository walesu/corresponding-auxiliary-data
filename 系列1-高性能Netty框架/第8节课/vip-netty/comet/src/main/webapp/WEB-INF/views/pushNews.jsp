<%@ page language = "java" contentType= "text/html; charset=UTF-8" pageEncoding= "UTF-8" %>
<%--
  ~ Copyright 2021-2022 the original author or authors
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  --%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>新闻推送</title>
</head>
<body>
<h1>每日头条</h1>
<div>
    <div>
        <h2>每日头条新闻实时看</h2>
        <div style="color:#F00"><b><p id="realTimeNews">  </p></b></div>
    </div>
    <hr>
    <div>
        对于美制裁中兴一事，商务部新闻发言人高峰19日在回答记者提问时再次强调，美方行径引起了市场对美国贸易和投资环境的普遍担忧，
        美方的行为表面针对中国，但最终伤害的是美国自身，不仅会使其丧失数以万计的就业机会，还会影响成百上千的美国关联企业，
        将会动摇国际社会对美国投资和营商环境稳定的信心。希望美方不要自作聪明，否则只会自食其果。也希望美方不要低估中方的决心，
        如果美方坚持通过单边主义的保护政策，不惜伤害中美两国企业利益，企图遏制中国发展，迫使中国作出让步，那是打错算盘，
        中方坚决捍卫国家和人民利益的决心和信心不会有丝毫动摇，我们会进行坚决的斗争。（记者于佳欣）
    </div>
    <hr>
    <div>
        [中国空军多型战机连续“绕岛巡航”检验实战能力]中国空军新闻发言人申进科大校4月19日发布消息，空军近日连续组织多架轰炸机、侦察机成体系“绕岛巡航”，锤炼提升维护国家主权和领土完整的能力。

        　　空军开展的海上方向实战化军事训练，出动了轰-6K、苏-30、歼-11和侦察机、预警机等多型多架战机。轰-6K等战机实施了“绕岛巡航”训练课题，提升了机动能力，检验了实战能力。

        　　轰-6K战机是中国自主研发的中远程新型轰炸机，担当投送国家威力和意志的重要使命。空军近年来远海远洋训练和绕岛巡航中，都有轰-6K战机的英姿。

        　　空军航空兵某师轰-6K机长翟培松表示，“这次绕岛巡航，我们用战神的航迹丈量祖国的大好河山，除了自豪，更多的是自信。改革开放、强军兴军，我们的战机更先进了，我们飞行员的翅膀更硬了，有自信和胆气应对任何挑战。祖国在我们心中，宝岛在祖国怀中。捍卫祖国的大好河山，是空军飞行员的神圣使命。”


        　　在新时代练兵备战中，空军依照相关国际法和国际实践，飞越宫古海峡、巴士海峡、对马海峡，持续组织海上方向实战实训。空军还要按照既定计划，继续组织多型战机“绕岛巡航”。

        　　空军航空兵某团轰-6K飞行员杨勇说，“这两天，我们接连绕岛巡航，战斗机不断刷新战斗航迹，飞行员不断刷新战斗经历。每一次绕岛巡航，都强一份使命担当、多一分血性胆气。听从祖国和人民的召唤，空军飞行员勇往直前。”

        　　走实训之路，练打赢之功。空军轰-6K飞行员群体聚研战谋战的心气、砺勇往直前的胆气、壮敢打必胜的底气、养砺剑亮剑的霸气，把“思想政治要过硬、打仗本领要过硬、战斗作风要过硬”的战略要求，落实到每一个战斗岗位、每一次战斗起飞。

        　　空军新闻发言人表示，按照“空天一体、攻防兼备”战略目标，空军深入开展海上方向实战化军事训练，备战打仗能力发生历史性变化。空军有坚定的意志、充分的信心和足够的能力，捍卫国家主权和领土完整。
    </div>
</div>
<script type="text/javascript" src="assets/js/jquery-1.9.1.min.js"></script>
<script type="text/javascript">

    longLoop();

    function longLoop() {
        $.get("realTimeNews",function (data) {
            console.log(data);
            $("#realTimeNews").html(data);
            longLoop();//马上再发起请求
        })
    }


</script>
</body>
</html>