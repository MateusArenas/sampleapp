import { PanResponder, Pressable, StyleSheet, Text, ImageBackground, View, Image, useWindowDimensions, TouchableOpacity, ScrollViewProps } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import AuthContext from '../contexts/auth';
import React from 'react';
import { sharedElementTransition } from '../helpers/SharedElementTransition';
import { RootStackScreenProps } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useScrollViewOffset,
    useSharedValue,
    withDecay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView, ScrollView, RefreshControl, GestureDetector, Gesture, NativeViewGestureHandler  } from 'react-native-gesture-handler';

import { sleep } from '../utils/sleep';
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);


export default function BlogPostScreen({ navigation, route }: RootStackScreenProps<'BlogPost'>) {
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);

  const scale = useSharedValue(1);

  const scaleMax = .8;

  const enabledX = useSharedValue(0);

  const scrollY = useSharedValue(0);

  const positionX = useSharedValue(0);

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const layout = useWindowDimensions();


  const [isPanEnabled, setIsPanEnabled] = React.useState(true);

  const updatePanState = (offset: number) => {
    'worklet';

    if (offset > 0) {
      runOnJS(setIsPanEnabled)(false);
    } else if (offset === 0) {
      runOnJS(setIsPanEnabled)(true);
    }
  };

const onScroll = useAnimatedScrollHandler({
  onScroll(event) {
    scrollY.value = event.contentOffset.y;
  },
  onBeginDrag({ contentOffset }) {
    updatePanState(contentOffset.y);
  },
  onEndDrag({ contentOffset }) {
    updatePanState(contentOffset.y);
  },
  onMomentumEnd({ contentOffset }) {
    updatePanState(contentOffset.y);
  },
});

  const scrollPanGesture = Gesture.Pan()
  .onStart(() => {
    scale.value = 1;
    translationY.value = 0;
    translationX.value = 0;
    
    enabledX.value = 0;
  })
  .onUpdate((event) => {

    translationX.value = event.translationX;
    translationY.value = event.translationY;

    positionX.value = event.absoluteX;

    if (positionX.value < 100) {
      enabledX.value = 1;
    }

  })
  .onFinalize(() => {
    scale.value = withSpring(1);
    translationY.value = 0;
    translationX.value = 0;

    enabledX.value = 0;
  })
  // .enabled(isPanEnabled);

  const nativeGesture = Gesture.Native();

  const composedGestures = Gesture.Simultaneous(
    scrollPanGesture,
    nativeGesture,
  );
  

  const wrapperGoBack = (scale: number, max: number) => {
    if ((scale <= max) && navigation.canGoBack()) {
        navigation.goBack();
    }
  };

  useDerivedValue(() => {

    let horizontal =  1 - (Math.abs(translationX.value) / layout.width);
    let vertical   =  1 - (Math.abs(translationY.value) / layout.height);

    if (translationX.value < 0) {
      horizontal = 1; // bloqueia scrolagem para lado esquedo
    }

    if (translationY.value > 0 && scrollY.value > 0 ) {
      vertical = 1; // bloqueia scrolagem para cima quando está abaixo
    }

    if (scrollY.value <= 0 && translationY.value > 0) {
      scale.value = (scale.value + vertical) / 2;
    }
    
    if (translationX.value > 20 && enabledX.value) {
      scale.value = (scale.value + horizontal) / 2;
    }

    runOnJS(wrapperGoBack)(scale.value, scaleMax);

    // runOnJS(wrapperUpdatePanState)(scale.value, scaleMax);

  });

  const animatedStyle = useAnimatedStyle(() => {

    return {
      transform: [
        {
          scale: Math.max(scaleMax, scale.value),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {

    return {
      transform: [
        {
          translateY: -scrollY.value,
        },
      ],
    };
  });



  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', async (e) => {

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        await sleep(30); // ajuste para deixar dar tempo
        // scale.value = scaleMax;

        if (navigation.canGoBack()) {
          navigation.dispatch(e.data.action);
        }

      }),
    [navigation]
  );



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

        {/* <PanGestureHandler ref={ref} 
            onGestureEvent={gestureHandler}  
            waitFor={aref}
        > */}
            <Animated.View style={[styles.container]}>
                    
                    <Animated.View style={[
                        { width: '100%', height: '100%', position: 'relative', overflow: 'hidden' },
                        { backgroundColor: "#D9D9D9", borderRadius: 10 },
                        animatedStyle
                    ]}
                        sharedTransitionTag={`tag-container`}
                    >

                    <AnimatedLinearGradient style={{ position: 'absolute', opacity: 0, width: '100%', height: 287, zIndex: 3 }}
                      colors={['transparent', 'rgba(0,0,0,0.3)']}
                      sharedTransitionTag={`tag-lineargradient`}
                    />
                      
                      <Animated.Image 
                          style={[{
                              zIndex: 8,
                              width: '100%',
                              height: 287,
                              backgroundColor: '#D9D9D9',
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                              position: 'absolute',
                          }, headerAnimatedStyle]}
                          source={{ uri: "https://redecredauto-blog.s3.sa-east-1.amazonaws.com/wp-content/uploads/2023/07/12120406/capa-89.jpg" }}
                          sharedTransitionTag={`tag-image`}
                      />



                    <View style={{ position: 'absolute', right: 32, top: 32, zIndex: 10, opacity: 1}}
                    >
                        <Pressable style={[
                            { backgroundColor: 'white', borderRadius: 100, width: 32, height: 32 },
                            { alignItems: 'center', justifyContent: 'center' },
                        ]}
                            disabled={!navigation.canGoBack()} onPress={navigation.goBack}
                        >
                            <Ionicons name="close" size={24}  
                                style={{ position: 'absolute'}}
                            />
                        </Pressable>
                    </View>

{/* <ScrollView scrollToOverflowEnabled={true}
    scrollIndicatorInsets={{ top: 287 }}
   canCancelContentTouches
   refreshControl={
    <View />
   }
>

</ScrollView> */}

                    <GestureDetector gesture={composedGestures}
                      
                    >
                        <Animated.ScrollView style={{ flex: 1, zIndex: 9 }} 
                            ref={scrollViewRef}
                            bounces={false}
                            onScroll={onScroll}
                            scrollEventThrottle={16}
                            // onScroll={scrollHandler}
                            contentContainerStyle={{ paddingTop: 287 }}
                            scrollIndicatorInsets={{ top: 287 }}
                        >


                                    
                                <Animated.View style={{ zIndex: 4, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}
                                    sharedTransitionTag={`tag-bottom`}
                                >

                                    <View style={{ flex: 1, paddingRight:20}}>
                                        <Animated.Text style={{ color: "black" }}
                                            sharedTransitionTag={`tag-subcard-title`}
                                        >
                                            Blog CredAuto
                                        </Animated.Text>
                                        <Animated.Text style={{ color: "black" }} numberOfLines={1}
                                            sharedTransitionTag={`tag-subcard-content`}
                                        >
                                            www.blog.redecredauto.com
                                        </Animated.Text>
                                    </View>

                                    <Animated.View style={{ width: 67, height: 25, backgroundColor: 'red' }} 
                                        sharedTransitionTag={`tag-subcard-button`}
                                    >
                                        <Text>ABRIR</Text>
                                    </Animated.View>
                                </Animated.View>

                                <Animated.View style={{ flex: 1, padding: 16, backgroundColor: "transparent", zIndex: 4 }}
                                    sharedTransitionTag={`tag-content`}
                                >
                                        <Text style={{ color: "black" }} >
                                            Blog CredAuto
                                        </Text>

                                        <Text style={{ color: "black" }}>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at purus
                                            euismod, vestibulum dolor a, pulvinar odio. Nunc suscipit felis eget
                                            est consequat, ac consequat metus aliquet. Vivamus faucibus libero sit
                                            amet semper molestie. Sed euismod ligula sit amet urna maximus
                                        </Text>
                                </Animated.View>
                                
                        </Animated.ScrollView>
                    </GestureDetector>


                    </Animated.View>
                    

        
            </Animated.View>
        {/* </PanGestureHandler> */}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
