import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TournamentBracket from 'react-svg-tournament-bracket';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';


const bracketPageInfo = {
    stages: [
        {
            stageid: 4,
            stage: '1/8',
            isCurrent: false,
            rounds: [
                {
                    usernameOfCompetitor1: 'Alex',
                    usernameOfCompetitor2: 'shoes',
                    stage: '1/8',
                    result: 'Alex win'
                },
                {
                    usernameOfCompetitor1: 'ferz',
                    usernameOfCompetitor2: 'griixy',
                    stage: '1/8',
                    result: 'ferz win'
                },
                {
                    usernameOfCompetitor1: 'messi228mmmmmmm',
                    usernameOfCompetitor2: null,
                    stage: '1/8',
                    result: 'messi228mmmmmmm autowin'
                },
                {
                    usernameOfCompetitor1: 'madaradanze',
                    usernameOfCompetitor2: 'gigi',
                    stage: '1/8',
                    result: 'gigi win'
                },
                {
                    usernameOfCompetitor1: 'reyn',
                    usernameOfCompetitor2: 'wayne',
                    stage: '1/8',
                    result: 'reyn win'
                },
                {
                    usernameOfCompetitor1: 'meinz',
                    usernameOfCompetitor2: 'hels',
                    stage: '1/8',
                    result: 'hels win'
                },
                {
                    usernameOfCompetitor1: 'lilly',
                    usernameOfCompetitor2: null,
                    stage: '1/8',
                    result: 'lilly autowin'
                },
                {
                    usernameOfCompetitor1: 'aiaiai',
                    usernameOfCompetitor2: 'bracketCon',
                    stage: '1/8',
                    result: 'bracketCon win'
                },
            ]
        },
        {
            stageid: 5,
            stage: '1/4',
            isCurrent: true,
            rounds: [
                {
                    usernameOfCompetitor1: 'Alex',
                    usernameOfCompetitor2: 'ferz',
                    stage: '1/4',
                    result: 'No'
                },
                {
                    usernameOfCompetitor1: 'messi228mmmmmmm',
                    usernameOfCompetitor2: 'gigi',
                    stage: '1/4',
                    result: 'No'
                },
                {
                    usernameOfCompetitor1: 'reyn',
                    usernameOfCompetitor2: 'hels',
                    stage: '1/4',
                    result: 'No'
                },
                {
                    usernameOfCompetitor1: 'lilly',
                    usernameOfCompetitor2: 'bracketCon',
                    stage: '1/4',
                    result: 'No'
                },
            ]
        },
        {
            stageid: 6,
            stage: '1/2',
            isCurrent: false,
            rounds: [
                {
                    usernameOfCompetitor1: null,
                    usernameOfCompetitor2: null,
                    stage: '1/2',
                    result: 'No'
                },
                {
                    usernameOfCompetitor1: null,
                    usernameOfCompetitor2: null,
                    stage: '1/2',
                    result: 'No'
                },
            ]
        },
        {
            stageid: 7,
            stage: 'final',
            isCurrent: false,
            rounds: [
                {
                    usernameOfCompetitor1: null,
                    usernameOfCompetitor2: null,
                    stage: 'final',
                    result: 'No'
                },
            ]
        }
    ],
    publicRounds: [




    ],
    winner: ''
}

const stageWidth = 150;
const stageBoxHeight = 30;
const horizontalIndent = 30;
const verticalIndent = 50;
const stageSpacing = 50;
const firstStage = bracketPageInfo.stages[0].stage;

const roundsOfFirstStage = bracketPageInfo.stages[0].rounds.length;

export default function Bracket() {

    const viewer = useRef(null);
    const [value, setValue] = useState({});


    useEffect(() => {
        viewer.current.fitToViewer();
    }, []);

    const svgBoxWidth = (stageWidth + stageSpacing) * bracketPageInfo.stages.length + horizontalIndent * 2 - stageSpacing;


    return (
        <Box height='100%' display='flex' alignItems='center' mt='5%'>
            <ReactSVGPanZoom
                SVGBackground='#0b0d13'
                tool='auto'
                detectAutoPan={false}
                customToolbar={() => <></>}
                ref={viewer}
                scaleFactor={1.1}
                scaleFactorMax={2}
                scaleFactorMin={0.5}
                preventPanOutside={false}
                width={750}
                height={400}
                value={value}
                onChangeValue={setValue}
                customMiniature={() => <></>}
            >
                <svg width={svgBoxWidth} height={316} >
                    <g fontFamily='Lato sans-serif' text-anchor="middle" dominant-baseline="central">
                        {bracketPageInfo.stages.map((stage, index) =>
                            <g key={index}>
                                <rect
                                    x={horizontalIndent + (stageWidth + stageSpacing) * index}
                                    y={verticalIndent}
                                    width={stageWidth}
                                    height={stageBoxHeight}
                                    fill='#2f3648'
                                />
                                <text
                                    fontSize={18}
                                    x={horizontalIndent + (stageWidth + stageSpacing) * index + stageWidth / 2}
                                    y={verticalIndent + stageBoxHeight / 2}
                                    fill='#eaeaea'
                                >
                                    {stage.stage}
                                </text>




                                {
                                    stage.rounds.map((round, roundIndex) =>
                                        <g fontSize={14} key={roundIndex}>
                                            <rect
                                                x={horizontalIndent + (stageWidth + stageSpacing) * index}
                                                y={verticalIndent * 1.5 + stageBoxHeight + (verticalIndent * 0.5 + stageBoxHeight * 3) * roundIndex + ((verticalIndent * 0.25 + stageBoxHeight * 1.5) + (verticalIndent * 0.5 + stageBoxHeight * 3) * roundIndex) * index}
                                                width={stageWidth}
                                                height={stageBoxHeight * 1.5}
                                                fill='#2f3648'
                                            />
                                        </g>
                                    )
                                }
                            </g>
                        )}
                    </g>
                </svg>
            </ReactSVGPanZoom>
        </Box>
    );
}