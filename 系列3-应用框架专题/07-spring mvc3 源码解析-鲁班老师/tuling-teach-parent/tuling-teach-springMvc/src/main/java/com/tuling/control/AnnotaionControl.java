package com.tuling.control;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by Tommy on 2017/10/17.
 */
@Controller
public class AnnotaionControl {

    @RequestMapping("/getName.do")
    public ModelAndView getName(String name){
        ModelAndView mv=new ModelAndView("/WEB-INF/page/userView.jsp");
        mv.addObject("name","hello :"+name);
        return mv;
    }
}
