package com.tuling.apm.test;

import com.tuling.apm.ApmContext;
import com.tuling.apm.collects.ServiceCollect;
import javassist.ByteArrayClassPath;
import javassist.CannotCompileException;
import javassist.ClassPool;
import javassist.NotFoundException;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.io.IOException;
import java.lang.instrument.ClassDefinition;
import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.Instrumentation;
import java.lang.instrument.UnmodifiableClassException;
import java.util.jar.JarFile;

/**
 * Created by Tommy on 2018/3/8.
 */
public class ServiceCollectTest {

    private ApmContext context;
    private MockInstrumentation instrumentation;
    private ServiceCollect serviceCollect;

    @Ignore
    @Before
    public void init() {
        instrumentation = new MockInstrumentation();
        context = new ApmContext(null, instrumentation);
        serviceCollect = new ServiceCollect(context, instrumentation);
    }

    @Ignore
    @Test
    public void collectTest() throws IOException, CannotCompileException, NotFoundException {
        String name = "com.tuling.apm.test.TestServiceImpl";
        byte[] classBytes = serviceCollect.transform(ServiceCollectTest.class.getClassLoader(), name);
        ClassPool pool = new ClassPool();
        pool.insertClassPath(new ByteArrayClassPath(name, classBytes));
        pool.get(name).toClass();
        new TestServiceImpl().getUser("111","dddd");
    }


    private static class MockInstrumentation implements Instrumentation {

        @Override
        public void addTransformer(ClassFileTransformer transformer, boolean canRetransform) {

        }

        @Override
        public void addTransformer(ClassFileTransformer transformer) {

        }

        @Override
        public boolean removeTransformer(ClassFileTransformer transformer) {
            return false;
        }

        @Override
        public boolean isRetransformClassesSupported() {
            return false;
        }

        @Override
        public void retransformClasses(Class<?>[] classes) throws UnmodifiableClassException {

        }

        @Override
        public boolean isRedefineClassesSupported() {
            return false;
        }

        @Override
        public void redefineClasses(ClassDefinition... definitions) throws ClassNotFoundException, UnmodifiableClassException {

        }

        @Override
        public boolean isModifiableClass(Class<?> theClass) {
            return false;
        }

        @Override
        public Class[] getAllLoadedClasses() {
            return new Class[0];
        }

        @Override
        public Class[] getInitiatedClasses(ClassLoader loader) {
            return new Class[0];
        }

        @Override
        public long getObjectSize(Object objectToSize) {
            return 0;
        }

        @Override
        public void appendToBootstrapClassLoaderSearch(JarFile jarfile) {

        }

        @Override
        public void appendToSystemClassLoaderSearch(JarFile jarfile) {

        }

        @Override
        public boolean isNativeMethodPrefixSupported() {
            return false;
        }

        @Override
        public void setNativeMethodPrefix(ClassFileTransformer transformer, String prefix) {

        }
    }
}
