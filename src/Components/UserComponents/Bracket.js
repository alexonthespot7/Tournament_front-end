import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { ReactSVGPanZoom } from 'react-svg-pan-zoom';

import Cookies from 'js-cookie';

import ContextWrapper from '../../context/ContextWrapper';

const stageWidth = 200;

const stageBoxHeight = 30;
const roundBoxHeight = stageBoxHeight * 1.5;

const horizontalIndent = 30;
const verticalIndent = 50;

const stageSpacing = 50;
const roundSpacing = verticalIndent * 0.25;

// value that keeps the full stage width (includes spacing);
const stageFullWidth = stageWidth + stageSpacing;

// value that keeps the full round height (includes the height of the round box and spacing);
const roundFullHeight = roundSpacing + roundBoxHeight;

const initialBracketPageInfo = {
    stages: [
        {
            stage: 'No',
            rounds: [],
            current: true
        }
    ],
    winner: ''
}

export default function Bracket() {
    const [loading, setLoading] = useState(true);
    const [bracketPageInfo, setBracketPageInfo] = useState(initialBracketPageInfo);
    const [value, setValue] = useState({});

    const viewer = useRef(null);

    const handleMouseEnter = useCallback(() => {
        // Function logic for mouse enter
    }, []);

    const handleMouseLeave = useCallback(() => {
        // Function logic for mouse leave
    }, []);

    const { windowSize, makeErrorAlert, makeWarningAlert, deleteCookies } = useContext(ContextWrapper);

    useEffect(() => {
        fetchBracketPageInfo();
    }, []);

    useEffect(() => {
        if (!loading) viewer.current.fitToViewer();
    }, [loading]);

    const fetchBracketPageInfo = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/bracket`, {
                method: 'GET',
                headers: { 'Authorization': Cookies.get('jwt') }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    deleteCookies();
                    makeErrorAlert('Your session has expired, login again please');
                } else {
                    makeErrorAlert(await response.text())
                }
                return null;
            }
            if (response.status === 202) {
                //redirect to main page
                makeWarningAlert('The bracket wasn\'t made yet')
            } else {
                response.json()
                    .then(data => {
                        setBracketPageInfo(data);
                        setLoading(false);
                    })
                    .catch(err => makeErrorAlert(err.message));
            }
        } catch (error) {
            makeErrorAlert(error.message);
        }
    }


    const findUsernameOfContestant = (round, contestantNumber) => {
        const isFirst = round.stage === firstStage;
        const username = round[`usernameOfCompetitor${contestantNumber}`];

        return username ? username : isFirst ? '—' : null;
    }

    const roundsOfFirstStage = bracketPageInfo.stages[0].rounds.length;

    const firstStage = bracketPageInfo.stages[0].stage;

    //finding the width of the svg box: each stage gets width of its width and stageSpacing (the last stage shouldn't have stageSpacing); 
    //Also there is a horizontalIndent on the both sides of the page
    const svgBoxWidth = stageFullWidth * bracketPageInfo.stages.length + horizontalIndent * 2 - stageSpacing;

    //finding the height of the svg box: The maximum height if on the first stage, because it has max rounds. 
    // We're taking double roundHeight into consideration, because we need free space between rounds for nice bracket visualizaiton (next stage rounds are placed between current stage rounds);
    const svgBoxHeight = 2 * roundFullHeight * roundsOfFirstStage + verticalIndent * 2 - roundSpacing;

    return (
        <Box
            height='100%'
            width='100%'
            display='flex'
            justifyContent='center'
            alignItems='center'
            mt='5%'
        >
            {!loading &&
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
                    width={windowSize.width * 0.9}
                    height={windowSize.height * 0.85}
                    value={value}
                    onChangeValue={setValue}
                    customMiniature={() => <></>}
                >
                    <svg width={svgBoxWidth} height={svgBoxHeight} >
                        <g
                            fontFamily='Lato sans-serif'
                            text-anchor='middle'
                            dominant-baseline='central'
                        >
                            {bracketPageInfo.stages.map((stage, stageIndex) => {

                                // Initial horizontal pos depends on the stage index;
                                // The vertical pos remains throughout all the stages;
                                const stageBoxHorizontalPos = horizontalIndent + stageFullWidth * stageIndex;

                                // The text is located in the center of the stage box
                                const stageTextHorizontalPos = stageBoxHorizontalPos + stageWidth * 0.5;
                                const stageTextVerticalPos = verticalIndent + stageBoxHeight * 0.5;

                                return (
                                    <g key={stageIndex}>
                                        {/* Displaying the stage box */}
                                        <rect
                                            x={stageBoxHorizontalPos}
                                            y={verticalIndent}
                                            width={stageWidth}
                                            height={stageBoxHeight}
                                            fill='#2f3648'
                                        />
                                        {/* 
                                        displaying the stage namig, e.g. 1/16, final, etc. 
                                    */}
                                        <text
                                            fontSize={17}
                                            x={stageTextHorizontalPos}
                                            y={stageTextVerticalPos}
                                            fill='#eaeaea'
                                        >
                                            {stage.stage}
                                        </text>
                                        {stage.rounds.map((round, roundIndex) => {
                                            // The value that doesn't get multiplied by roundIndex and remains the same:
                                            // includes initial vertical indent and stage box height and the spacing between which equals to half of the vertical indent
                                            const initialVerticalIndentForRound = verticalIndent + stageBoxHeight + verticalIndent * 0.5;

                                            // Represents the space between rounds of the current stage, allowing room for the next stage's rounds to fit between them
                                            const spaceBetweenRounds = 2 * roundFullHeight * roundIndex;

                                            // Calculates the additional space required to position rounds of the next stage between current stage rounds
                                            const additionalSpaceForNextStage = (roundFullHeight + spaceBetweenRounds) * (2 ** stageIndex - 1);

                                            // Calculate the total vertical position accounting for initial indent and all calculated spaces
                                            const roundBoxVerticalPos = initialVerticalIndentForRound + spaceBetweenRounds + additionalSpaceForNextStage;

                                            // the horizontal position for the username's boxes is the same as the stage box's one;
                                            // adding 3 points as horizontal margin
                                            const contestantBoxHorizontalPos = stageBoxHorizontalPos + 3;

                                            // the vertical position for the first contestant's username box;
                                            // adding 1.25 for the vertical margin 
                                            const contestant1BoxVerticalPos = roundBoxVerticalPos + 1.25;

                                            // the vertical position for the second contestant's username box;
                                            const contestant2BoxVerticalPos = contestant1BoxVerticalPos + roundBoxHeight * 0.5;

                                            // the width of the box for contestant's username. Retracting 6 points for horizontal margin (3 on both sides);
                                            const contestantBoxWidth = stageWidth - 6;

                                            // the height of the box for contestant's username.
                                            // RoundBox has two contestant boxes, that's why its height is divided by two;
                                            // Retracting 2.5 points for vertical margin (1.25 from top and from bottom);
                                            const contestantBoxHeight = roundBoxHeight * 0.5 - 2.5;

                                            // the horizontal position for the cotnestant's username (it's placed in the center of contestant box);
                                            const contestantTextHorizontalPos = contestantBoxHorizontalPos + contestantBoxWidth * 0.5;

                                            // the vertical position for the first (in round) contestant's username. 
                                            const contestant1TextVerticalPos = contestant1BoxVerticalPos + contestantBoxHeight * 0.5;

                                            // The vertical position for the second contestant's username text
                                            const contestant2TextVerticalPos = contestant2BoxVerticalPos + contestantBoxHeight * 0.5;


                                            // Lines are used for the rounds connection;
                                            // Each round has two lines: a horizontal which is as wide as half of stage spacing and a vertical which is half of the round spacing of current stage;
                                            // Also each pair of rounds has one mutual horizontal line to connect this pair with the round of the next stage

                                            // The initial horizontal position for the first line
                                            const initHorizontalLine1Pos = stageBoxHorizontalPos + stageWidth;

                                            // The end horizontal position for the first line;
                                            const endHorizontalLine1Pos = initHorizontalLine1Pos + stageSpacing / 2;

                                            // The vertical position for the first line: it's located in the middle of the round box:
                                            const verticalLine1Pos = roundBoxVerticalPos + roundBoxHeight / 2;

                                            // The additional spacing growth exponentially each stage, as the space between rounds grow;
                                            const additionalHeightForEndVerticalLine2Pos = roundFullHeight * (2 ** stageIndex);

                                            // The end vertical position for the second line (vertical one):
                                            // for the rounds with even indexes line should go down, for the rounds with odd indexes the line should go up
                                            const endVerticalLine2Pos = verticalLine1Pos + (roundIndex % 2 == 0 ? additionalHeightForEndVerticalLine2Pos : -additionalHeightForEndVerticalLine2Pos);

                                            // The end horizontal position for the third line (the last one, horizontal);
                                            const endHorizontalLine3Pos = endHorizontalLine1Pos + stageSpacing / 2;

                                            return (
                                                <g fontSize={14} key={roundIndex}>
                                                    {/* 
                                                    Displaying the box-holder for the round;
                                                    the horizontal position depends on the stage and equals stage horizontal position;
                                                 */}
                                                    <rect
                                                        x={stageBoxHorizontalPos}
                                                        y={roundBoxVerticalPos}
                                                        width={stageWidth}
                                                        height={roundBoxHeight}
                                                        fill='#22283b'
                                                    />

                                                    {/*
                                                    Displaying the first contestant box and username (in the center of the box);
                                                    The horizontal position is the same for both contestants
                                                */}
                                                    <rect
                                                        onMouseEnter={handleMouseEnter} // Function to call on mouse enter
                                                        onMouseLeave={handleMouseLeave}
                                                        x={contestantBoxHorizontalPos}
                                                        y={contestant1BoxVerticalPos}
                                                        width={contestantBoxWidth}
                                                        height={contestantBoxHeight}
                                                        fill={round.result.includes(findUsernameOfContestant(round, '1')) ? '#1d2232' : '#141822'}
                                                    />
                                                    <text
                                                        x={contestantTextHorizontalPos}
                                                        y={contestant1TextVerticalPos}
                                                        fill={round.result.includes(findUsernameOfContestant(round, '1')) ? '#eaeaea' : '#596b88'}
                                                    >
                                                        {findUsernameOfContestant(round, '1')}
                                                    </text>

                                                    {/*  Displaying the second contestant box and username (in the center of the box) */}
                                                    <rect
                                                        x={contestantBoxHorizontalPos}
                                                        y={contestant2BoxVerticalPos}
                                                        width={contestantBoxWidth}
                                                        height={contestantBoxHeight}
                                                        fill={round.result.includes(findUsernameOfContestant(round, '2')) ? '#1d2232' : '#141822'}
                                                    />
                                                    <text
                                                        x={contestantTextHorizontalPos}
                                                        y={contestant2TextVerticalPos}
                                                        fill={round.result.includes(findUsernameOfContestant(round, '2')) ? '#eaeaea' : '#596b88'}
                                                    >
                                                        {findUsernameOfContestant(round, '2')}
                                                    </text>

                                                    {//The lines should be displayed for each stage, except final
                                                        // Lines are showing the rounds connections
                                                        round.stage !== 'final' && <g style={{ stroke: '#282e3d', strokeWidth: 2 }}>
                                                            {/* 
                                                            First horizontal line:
                                                        */}
                                                            <line
                                                                x1={initHorizontalLine1Pos}
                                                                x2={endHorizontalLine1Pos}
                                                                y1={verticalLine1Pos}
                                                                y2={verticalLine1Pos}
                                                            />
                                                            {/* 
                                                            Vertical line: 
                                                        */}
                                                            <line
                                                                x1={endHorizontalLine1Pos}
                                                                x2={endHorizontalLine1Pos}
                                                                y1={verticalLine1Pos}
                                                                y2={endVerticalLine2Pos}
                                                            />
                                                            {/*
                                                            The second horizontal line and the last one:
                                                        */}
                                                            <line
                                                                x1={endHorizontalLine1Pos}
                                                                x2={endHorizontalLine3Pos}
                                                                y1={endVerticalLine2Pos}
                                                                y2={endVerticalLine2Pos}
                                                            />
                                                        </g>
                                                    }
                                                </g>
                                            );
                                        })}
                                    </g>
                                );
                            })}
                        </g>
                    </svg>
                </ReactSVGPanZoom>
            }
            {loading && <CircularProgress color='secondary' />}
        </Box>
    );
}