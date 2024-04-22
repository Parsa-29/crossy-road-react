import React, { useEffect, useRef, useState } from 'react';
import PlayerContent, { usePlayerContent } from '@/context/PlayerContent';
import Grass from './map/Grass';
import Road from './map/Road';
import Water from './map/Water';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import 'react-virtualized/styles.css';

const Biomes = ({ quantity, biome }: { quantity: number, biome: number }) => {

    if (biome === 0) {
        return (
            <React.Fragment>
                <Water quantity={quantity} />
                <Grass />
            </React.Fragment>
        )
    } else if (biome === 1) {

        return (
            <React.Fragment>
                <Road quantity={quantity} />
                <Grass />
            </React.Fragment>
        )
    } else if (biome === 2) {
        return (
            <div className="biome block-shadow-start">
                <div className='grass-box'></div>
                <div className='column grass' />
                <div className='column grass' />
                <div className='column grass' />
                <div className='column grass' />
                <div className='column grass' />
                <div className='column grass' />
            </div>
        )
    }

    return (
        <div className="biome block-shadow-start">
            <div className='column grass' />
        </div>
    )
}

const RenderMap = () => {
    const { player } = usePlayerContent() as any;
    const bottomRowRef = useRef(null);
    const [biomeList, setBiomeList] = useState([]) as any;
    const [containerSize, setContainerSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const [checkList, setCheckList] = useState(false);
    const [bHeight, setBHeight] = useState(0);
    const [bottomRowIndex, setBottomRowIndex] = useState(0); // Track the bottom row index

    useEffect(() => {
        setBiomeList(() => {
            let biomeList: any = [
                <div className="biome block-shadow-start" key={""}>
                    <div className='column grass' />
                </div>
            ];

            setTimeout(() => {
                for (let i = 0; i < 500; i++) {
                    const quantity = Math.floor(Math.random() * 4) + 1;
                    //0 or 1
                    const biome = Math.floor(Math.random() * 2) as number;
                    biomeList.push({
                        biome: <><Biomes quantity={quantity} biome={biome} /></>
                    });
                }

                setBiomeList(biomeList);
            }, 1000);

            biomeList.push({
                biome: (
                    <div className="biome block-shadow-start">
                        <div className='grass-box'></div>
                        <div className='column grass' />
                        <div className='column grass' />
                        <div className='column grass' />
                        <div className='column grass' />
                        <div className='column grass' />
                        <div className='column grass' />
                    </div>
                ),
            })

            return biomeList;
        });

        console.log(biomeList);
    }, []);

    useEffect(() => {
        const crossy_road_container = document.querySelector('.game-container') as HTMLElement;
        setTimeout(() => {
            if (crossy_road_container) {
                setContainerSize({
                    width: crossy_road_container.offsetWidth,
                    height: crossy_road_container.offsetHeight
                });
            }
        }, 500);
    }, []);

    const cacheRef = useRef(
        new CellMeasurerCache({
            defaultWidth: containerSize.width || 1000,
            defaultHeight: 100, // Set default row height
            fixedWidth: true
        })
    );

    const cellRenderer = ({ index, key, parent, style }: { index: number, key: string, parent: any, style: any }) => {
        const item = biomeList[index];
        const isBottomRow = index === biomeList.length - 1;

        return (
            <CellMeasurer
                cache={cacheRef.current}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                {({ measure }) => (
                    <div
                        style={{
                            ...style,
                            display: 'block',
                            width: containerSize.width || 1000,
                            height: item.height,
                        }}
                        ref={isBottomRow ? bottomRowRef : null} // Assign the ref to the bottom row element
                        onLoad={isBottomRow ? measure : undefined}
                    >
                        {item.biome}
                    </div>
                )}
            </CellMeasurer>
        );
    };

    useEffect(() => {
        cacheRef.current.clearAll();
    }, [biomeList]);

    useEffect(() => {
        // set className to queryselector #biome-container's first children
        const biomeContainer = document.querySelector('#biome-container') as HTMLElement;
        const biomeContainerFirstChild = biomeContainer.firstElementChild as HTMLElement;
        biomeContainerFirstChild.classList.add('biome-container-first-child');
    }, []);

    // Use a ref to access the List component and scroll to the bottom after rendering
    const listRef = useRef(null);

    // useEffect(() => {
    //     // Scroll to the bottom of the List after rendering
    //     setTimeout(() => {
    //         if (listRef.current) {
    //             listRef.current.scrollToRow(biomeList.length - 1);
    //         }
    //     }, 550);
    // }, [biomeList.length]);

    useEffect(() => {
        setTimeout(() => {
            setCheckList(true);
        }, 1000);
    }, []);

    useEffect(() => {
        const a = document.querySelector('.player-container');
        const b = document.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
        setTimeout(() => {
            if (b && a) {
                b.appendChild(a);
                setBHeight(b.clientHeight);
            }
        }, 100);
    }, [checkList])

    useEffect(() => {
        const player = document.querySelector('.player') as HTMLElement;

        //always center player in screen when player is in screen
        if (player) {
            const screenTop = document.querySelector('.screenTop')?.getBoundingClientRect();
            const screenBottom = document.querySelector('.screenBottom')?.getBoundingClientRect() as DOMRect;
            const playerRect = player.getBoundingClientRect();

            player.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });

            if (
                playerRect.left >= screenBottom.left &&
                playerRect.right <= screenBottom.right &&
                playerRect.top >= screenBottom.top &&
                playerRect.bottom <= screenBottom.bottom
            ) {
                player.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                });
            }

            //scroll to bottom of page
            if (playerRect.bottom >= bHeight) {
                player.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                });
            }
        }
    }, [player]);

    return (
        <div
            id="biome-container"
            style={{
                width: '100%',
                height: containerSize.height,
            }}
        >
            <AutoSizer>
                {({ height, width }) => {
                    return (
                        <List
                            ref={listRef}
                            rowCount={biomeList.length}
                            deferredMeasurementCache={cacheRef.current}
                            rowHeight={cacheRef.current.rowHeight}
                            rowRenderer={cellRenderer}
                            height={height}
                            width={width}
                            style={{
                                transform: 'rotate(180deg)',
                                width: containerSize.width,
                            }}
                            //render only 4 rows at a time
                            overscanRowCount={0}
                            overscanColumnCount={0}
                        />
                    );
                }}
            </AutoSizer>
        </div>
    );
};

export default RenderMap;