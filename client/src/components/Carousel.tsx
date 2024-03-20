import React from "react";
import { useState, TouchEvent } from "react";

interface CarouselProp {
    slides: string[];
}

export default function Carousel({ slides }: CarouselProp) {
    const [currentImg, setCurrentImg] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 60

    const handleImgChange = (id: number) => {
        setCurrentImg(id);
    }

    const handleLeftSwipe = () => {
        if (currentImg === slides.length - 1) {
            setCurrentImg(0);
        } else {
            setCurrentImg(currentImg + 1);
        }
    }

    const handleRightSwipe = () => {
        if (currentImg === 0) {
            setCurrentImg(slides.length - 1);
        } else {
            setCurrentImg(currentImg - 1);
        }
    }

    const onTouchStart = (e: TouchEvent) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
        handleLeftSwipe();
    } else if(isRightSwipe) {
        handleRightSwipe();
    }
    setTouchStart(null); // Reset touchStart and touchEnd
    setTouchEnd(null);
}

    return(
    <div className="overflow-hidden bg-gray-800 w-full h-full" onTouchEnd={onTouchEnd}>
        <div className={`flex justify-center items-center transition ease-out duration-300 h-4/5`} >
            {slides.map((slide: string, index: number) => {
                return <img key={index} src={slide} className={`${index === currentImg ? 'block' : 'hidden'} object-fit w-128 h-128`} onTouchStart={onTouchStart} onTouchMove={onTouchMove}/>
            })}    
        </div>
        <div className="flex mt-2 w-full justify-center items-center text-white gap-4">
            {slides.map((slide: string, index: number) => {
                return <button 
                            key={index} 
                            className={`rounded-full h-2 w-2 border-[1px] border-gray-50 ${index === currentImg ? 'bg-gray-50' : ''}`} 
                            onClick={() => {
                                handleImgChange(index)
                            }
                        }/>
            })}
        </div>
        
    </div>
    );
}