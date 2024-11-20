import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"

export default function TestCark() {
    const router = useRouter();
    const [gameSettings, setGameSettings] = useState([]);
    useEffect(() => {
        const customerId = sessionStorage.getItem("customerId") || 2;
        // if (customerId === null) router.push("/");

        if (customerId) {
            GetGameSettings(customerId);
        }
    }, []);

    const GetGameSettings = async (customerId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/gameSettings/${customerId}`);
            setGameSettings(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const insertGameWinner = async (selectedSegment) => {
        const customerId = sessionStorage.getItem("customerId") || 2;

        const requestData = {
            customer_id: customerId,
            award: selectedSegment.part_name,
            date: new Date().toISOString(),
            code: selectedSegment.coupon_code,
            is_used: 0,
            used_time: null
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/gameWinners`, requestData);
            console.log("Başarılı:", response.data);
        } catch (error) {
            console.error("Hata:", error);
        }
    };

    useEffect(() => {
        const loadScript = (url) => new Promise((resolve, reject) => {
            const script = document.createElement('script');

            script.async = true;
            script.type = 'text/javascript';
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });

        const scriptSource = [
            { name: 'jQuery', url: 'https://code.jquery.com/jquery-3.3.1.min.js' },
        ];

        Promise.all(scriptSource.map((scriptUrl) => loadScript(scriptUrl.url))).then(() => {
            (($) => {
                $(document).ready(() => {
                    'use strict';
                    let selectedSegment = {};

                    const self = {};

                    // Örnek renk paleti
                    const colors = ['#FF5733', '#33FF57', '#5733FF', '#FFD700', '#FF6347', '#8A2BE2'];

                    // Rastgele renk seçme fonksiyonu
                    const getRandomColor = () => {
                        const randomIndex = Math.floor(Math.random() * colors.length);
                        return colors[randomIndex];
                    };

                    // Örnek gameSettings verisi
                    const variables = {
                        addedSliceNames: [],
                        slicesRotate: [],
                        slicesText: [],
                        selectedText: '',
                    };

                    // Daha önce eklenmiş verileri temizle
                    variables.addedSliceNames = [];

                    if (!variables) {
                        // Yeni verileri ekle
                        gameSettings.forEach(setting => {
                            variables.addedSliceNames.push({
                                id: setting.id,
                                name: setting.part_name,
                                color: getRandomColor(),
                            });
                        });
                    }

                    console.log(variables)
                    let config = {
                        radius: 180,
                        rotationTime: 5,
                        animationTime: 15,
                        rotateCount: 5,
                        startButtonText: 'Çevir',
                        spinHeaderText: 'Hediye Kazanmak İçin Çevir!',
                        isAnimation: true,
                        stopperUp: true,
                        confetti: true,
                        onlyLetters: true,
                        stopperDirection: 'top',
                        spinContainerColor: '#363A5D',
                        spinAddContainerColor: '#363A5D',
                        containerColor: '#1F2544',
                        spinButtonColor: '#416B58',
                        spinAddButtonColor: '#416B58',
                        spinOuterCircleColor: '#436850',
                        spinInnerCircleColor: '#ADBC9F',
                        winnerPopupBackground: '#363A5D',
                        stopperColor: '#416B58',
                        spinImage: 'https://i.hizliresim.com/cw090v2.png',
                    };

                    const defaultConfig = { ...config };

                    const classes = {
                        style: 'style',
                        container: 'wof-container',
                        wrapper: 'wof-wrapper',
                        sliceContainer: 'wof-slice-container',
                        slices: 'wof-slices',
                        spinContainer: 'wof-spin-container',
                        slice: 'wof-slice',
                        sliceText: 'slice-text',
                        spinIcon: 'wof-spin',
                        spinIconImage: 'wof-spin-image',
                        spinStopper: 'wof-spin-stoper',
                        spinStopperContainer: 'wof-spin-stoper-container',
                        spinHeaderContainer: 'wof-spin-header-container',
                        spinBackground: 'wof-spin-background',
                        spinStartButton: 'wof-spin-start-button',
                        spinHeader: 'wof-spin-header',
                        spinStartContainer: 'wof-spin-start-container',
                        dynamicWinRate: 'wof-dynamic-win-rate',
                        dynamicSliceText: 'wof-dynamic-slice-text',
                        spinCloseContainer: 'wof-spin-close-container',
                        spinCloseButton: 'wof-spin-close-button',
                        checkboxSwitch: 'wof-spin-switch',
                        checkboxForSlider: 'wof-spin-slider',
                        checkboxForRound: 'wof-spin-round',
                        dynamicSliceTextDelete: 'wof-dynamic-slice-text-delete',
                        winnerText: 'wof-winner-text',
                        startButtonDisabled: 'wof-start-button-disabled',
                        sliceNameInputError: 'wof-slice-name-input-error',
                        winnerPopupContainer: 'wof-winner-popup-container',
                        winnerPopup: 'wof-winner-popup',
                        winnerPopupShow: 'wof-winner-popup-show',
                        winnerPopupClose: 'wof-winner-popup-close',
                        winnerIcon: 'wof-winner-icon',
                        icons: 'wof-icons',
                        fakeSliceText: 'wof-fake-slice-text',
                        winnerHeader: 'wof-winner-header',
                        laodingScreenContainer: 'wof-loading-screen-container',
                        loadingScreenText: 'wof-loading-screen-text',
                        loadingScreenContent: 'wof-loading-screen-content',
                    };

                    const selectors = Object.keys(classes).reduce((createdSelector, key) => (
                        createdSelector[key] = `.${classes[key]}`, createdSelector
                    ), {});

                    self.init = (starter) => {
                        self.reset();
                        self.buildCSS();
                        self.buildHTML();
                        self.setEvents();
                        // self.getSlicesLocal();
                        // self.firstGenerateSlice()
                        setTimeout(() => {
                            const loadingScreen = $('.wof-loading-screen-container');
                            const loadingStyle = $('.wof-loading-style');

                            if (loadingScreen.length > 0) {
                                loadingScreen.remove();
                                loadingStyle.remove();
                            }
                        }, 1000);
                    };

                    self.firstGenerateSlice = () => {
                        gameSettings.forEach(setting => {
                            if (setting.part_name.trim()) { // part_name'in geçerli olup olmadığını kontrol et
                                self.addSlice(setting.part_name.trim());
                            }
                        });

                        // Slice genişliklerini yeniden hesapla
                        self.remakeSlicesWidth();
                    };

                    self.reset = () => {
                        const { style, container, wrapper } = selectors;

                        $(`${style}, ${container}, ${wrapper}`).remove();
                    };

                    self.buildCSS = () => {
                        const { container, wrapper, sliceContainer, slice, spinIcon, sliceText, spinStopper, spinBackground,
                            spinStartButton, spinIconImage, spinHeader, spinHeaderContainer, slices, spinStopperContainer,
                            spinContainer,
                            winnerText, dynamicSliceText, checkboxSwitch,

                            spinCloseContainer, spinCloseButton, winnerIcon,
                            checkboxForSlider, startButtonDisabled, checkboxForRound, dynamicWinRate,
                            spinStartContainer, icons, winnerPopupContainer, winnerPopup, fakeSliceText,
                            winnerPopupShow, winnerPopupClose, winnerHeader } = selectors;

                        const { stopperDirection, stopperUp, isAnimation, spinContainerColor, spinOuterCircleColor,
                            stopperColor, spinInnerCircleColor, spinAddButtonColor, spinAddContainerColor, spinButtonColor,
                            animationTime, containerColor, winnerPopupBackground } = config;

                        const stoperLocal = (stoperName, stoperCondition) => stopperDirection === stoperName &&
                            stopperUp === stoperCondition;
                        const stoperPosition = (stoperCondition) => (stopperUp === stoperCondition ? 'position: absolute;' : '');

                        const customStyle =
                            `@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@500&display=swap');
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                            font-family: 'Ubuntu', sans-serif;
                        }
                        html, body {
                            margin: 0;
                            padding: 0;
                            overflow-x: hidden;
                        }
                        ${container} {

                        }
                        ${wrapper} {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                            position: relative;
                            background-color: ${containerColor};
                        }
                        ${wrapper} svg:not(${icons}) {
                            position: absolute !important;
                            z-index: 99999999;  
                        }
                        ${spinBackground} {
                            height: 800px;
                            width: 450px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 30px;
                            flex-direction: column;
                            background-color: ${spinContainerColor};
                            border-radius: 10px;
                            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.35);
                            flex: 0 calc((100% / 3) + 60px);
                            position: relative;
                        }
                        ${winnerText} {
                            color: ${self.findDarkColor(winnerPopupBackground) ? '#000' : '#FFF'};
                            position: absolute;
                            top: 60%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            font-size: 30px;
                            text-transform: capitalize;
                            width: max-content;
                        }
                        ${spinHeaderContainer} {
                            width: calc(100% - (60 * 2px));
                        }
                        ${spinHeader} {
                            font-size: 23px;
                            color: ${self.findDarkColor(spinContainerColor) ? '#000' : '#FFF'};
                            font-weight: 900;
                            text-align: center;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        ${spinContainer} {
                            border: 25px solid ${spinOuterCircleColor};
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.35);
                        }
                        ${spinStopperContainer} {
                            ${stoperPosition(false)}
                            ${stoperLocal('top', false) ? 'transform: rotate(180deg); top: 160px;' : ''}
                            ${stoperLocal('bottom', false) ? 'transform: rotate(360deg); bottom: 160px;' : ''}
                            ${stoperLocal('left', false) ? 'transform: rotate(270deg); left: 175px;' : ''}
                            ${stoperLocal('right', false) ? 'transform: rotate(90deg); right: 175px;' : ''}
                            z-index: 999;
                        }
                        ${spinStopper} {
                            ${stoperPosition(true)}
                            ${stopperDirection === 'top' || stopperDirection === 'bottom' ? 'left: 50%;' : ''}
                            ${stoperLocal('bottom', true) ? 'bottom: -60px; transform: translate(-50%, -50%) rotate(180deg);' : ''} 
                            ${stoperLocal('top', true) ? ' top: -5px; transform: translate(-50%, -50%) rotate(0deg);' : ''} 
                            ${stoperLocal('right', true) ? 'right: -65px; transform: translate(-50%, -50%) rotate(90deg);' : ''}
                            ${stoperLocal('left', true) ? 'left: -5px;transform: translate(-50%, -50%) rotate(270deg);' : ''}
                            background-image: url(${self.setSvgColor(`<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                            width="161.000000pt" height="150.000000pt" viewBox="0 0 161.000000 150.000000">
                                <g transform="translate(0.000000,150.000000) scale(0.100000,-0.100000)"
                                fill="${config.stopperColor}" stroke="none">
                                <path d="M730 1269 c-110 -25 -220 -136 -245 -249 -14 -61 -7 -157 15 -205 25
                                -56 48 -108 121 -272 12 -27 34 -76 50 -111 16 -35 29 -65 29 -67 0 -3 14 -34
                                30 -70 17 -36 30 -69 30 -74 0 -15 27 -20 43 -8 22 18 305 582 323 644 31 107
                                0 231 -80 316 -71 75 -215 119 -316 96z"/>
                            </g>
                            </svg>`)});
                            background-size: contain;
                            height: 55px;
                            width: 60px;
                            filter: drop-shadow(0px 0px 10px rgba(0, 0, 0));
                        }
                        ${spinStopper}::before {
                            content: '';
                            height: 6px;
                            border-radius: 50%;
                            top: 15px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 6px;
                            position: absolute;
                            background-color: ${self.findDarkColor(stopperColor) ? '#000' : '#FFF'};
                        }
                        ${sliceContainer} {
                            border-radius: 50%;
                            height: 390px;
                            width: 390px;
                            position: relative;
                            border: 20px solid ${spinInnerCircleColor};
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            overflow: hidden;
                            ${isAnimation ? `animation: rotate ${animationTime}s infinite linear;` : 'animation: none;'}
                        }
                        ${slices} {
                            height: 360px;
                            width: 360px;
                            border-radius: 50%;
                            position: absolute;
                        }
                        ${slice} {
                            position: absolute;
                            width: 0;
                            height: 0;
                            border-style: solid;
                            opacity: 1;
                            left: 0px;
                            right: 0;
                            margin: 0 auto;
                            text-transform: capitalize;
                        }
                        ${sliceText} {
                            position: absolute;
                            top: -110px;
                            left: 50%;
                            transform: translateX(-50%) rotate(90deg);
                            width: max-content;
                            font-weight: 500;
                        }
                        ${fakeSliceText} {
                            position: absolute;
                            top: -125px;
                            left: 50%;
                            font-size: 20px;
                            transform: translateX(-50%) rotate(90deg);
                            width: max-content;
                            font-weight: 500;
                        }
                        ${spinIcon} {
                            position: absolute;
                            height: 50px;
                            width: 50px;
                            border-radius: 50%;
                        }
                        ${spinIconImage} {
                            width: 100%;
                            height: 100%;
                        }
                        ${spinStartContainer} {
                            width: 100%;
                            display: flex;
                            justify-content: center;
                        }
                        ${spinStartButton} {
                            width: calc(100% - (60 * 2px));
                            height: 50px;
                            border-radius: 5px;
                            background-color: ${spinButtonColor};
                            color: ${self.findDarkColor(spinButtonColor) ? '#000' : '#FFF'};
                            border: none;
                            cursor: pointer;
                            font-weight: 900;
                            font-size: 23px;
                            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.35);
                            padding: 0 40px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        ${startButtonDisabled} {
                            background-color: #ccc;
                            pointer-events: none;
                        }
                        ${spinStartContainer}:has(${startButtonDisabled}) {
                            cursor: not-allowed;
                        }
                        ${dynamicWinRate} {
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                            font-size: 17px;
                            font-weight: 800;
                            color: ${self.findDarkColor(spinAddContainerColor) ? '#000' : '#FFF'};
                        }
                        ${dynamicSliceText}:before {
                            content: '';
                            height: 6px;
                            position: absolute;
                            width: 6px;
                            background: ${self.findDarkColor(spinAddContainerColor) ? '#000' : '#FFF'};
                            top: 50%;
                            transform: translateY(-50%);
                            border-radius: 50%;
                            left: 5px;
                        }
                        ${spinCloseContainer} {
                            position: absolute;
                            right: 10px;
                            top: 10px;
                            z-index: 9992;
                        }
                        ${spinCloseButton} {
                            font-size: 20px;
                            color: #fff;
                            cursor: pointer;
                        }
                        ${checkboxSwitch} {
                            position: relative;
                            display: inline-block;
                            width: 60px;
                            height: 34px;
                        }
                        ${checkboxForSlider} {
                            position: absolute;
                            cursor: pointer;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-color: #ccc;
                            -webkit-transition: .4s;
                            transition: .4s;
                        }
                        ${checkboxForSlider}:before {
                            position: absolute;
                            content: "";
                            height: 26px;
                            width: 26px;
                            left: 4px;
                            bottom: 4px;
                            background-color: white;
                            -webkit-transition: .4s;
                            transition: .4s;
                        }
                        ${checkboxForSlider}${checkboxForRound} {
                            border-radius: 34px;
                        }
                        ${checkboxForSlider}${checkboxForRound}:before {
                            border-radius: 50%;
                        }
                        ${winnerPopupContainer} {
                            z-index: 99999;
                            width: 100%;
                            position: absolute;
                            height: 100%;
                            background: rgb(0 0 0 / 37%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            display: none;
                        }
                        ${winnerPopupContainer}${winnerPopupShow} {
                            display: flex;
                        }
                        ${winnerPopup} {
                            width: 600px;
                            height: 200px;
                            background: ${winnerPopupBackground};
                            border-radius: 10px;
                            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.35);
                            position: relative;
                        }
                        ${winnerHeader} {
                            width: 100%;
                            height: 60px;
                            border-radius: 10px 10px 0 0;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            padding-left: 200px;
                            font-size: 25px;
                        }
                        ${winnerPopupClose} {
                            position: absolute;
                            top: 15px;
                            right: 10px;
                            cursor: pointer;
                        }
                        ${winnerIcon} {
                            position: absolute;
                            left: 165px;
                            height: 28px;
                            width: 30px;
                        }
                        @keyframes rotate {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                        `;

                        $('head').append($('<style>').addClass(classes.style).text(customStyle));
                    };

                    self.onlyLetters = (text) => text.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ, ]/g, '');

                    self.setSvgColor = (svg) => `"data:image/svg+xml,${encodeURIComponent(svg)}"`;

                    self.buildHTML = () => {
                        const { container, wrapper, spinContainer, sliceContainer, spinIcon, spinStopper, spinBackground,
                            spinStartButton, spinIconImage, slices, spinStartContainer, spinHeaderContainer, spinHeader, icons,
                            spinStopperContainer,

                            winnerPopupContainer,
                            winnerPopup, winnerPopupClose, winnerHeader,
                            winnerIcon } = classes;

                        const { startButtonText, spinImage, spinHeaderText } = config;

                        const mainHtml =
                            `<div class="${container}">
                            <div class="${wrapper}">
                                <div class="${spinBackground}">
                                    <div class="${spinHeaderContainer}">
                                        <div class="${spinHeader}">${spinHeaderText}</div>
                                    </div>
                                    <div class="${spinContainer}">
                                        <div class="${spinStopperContainer}">
                                            <div class="${spinStopper}"></div>
                                        </div>
                                        <div class="${sliceContainer}">
                                            <div class="${slices}"></div>
                                        </div>
                                        <div class="${spinIcon}">
                                            <img class="${spinIconImage}" src="${spinImage}">
                                        </div>
                                    </div>
                                    <div class="${spinStartContainer}">
                                        <button class="${spinStartButton}">${startButtonText}</button>
                                    </div>
                                </div>
                                <div class="${winnerPopupContainer}">
                                    <div class="${winnerPopup}">
                                        <div class="${winnerHeader}">
                                            <div>Kazandiniz!</div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
                                            class="${icons} ${winnerIcon}"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3
                                                16h14"/>
                                            </svg>
                                        </div>
                                        <div class="${winnerPopupClose}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" 
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                                            stroke-linejoin="round" class="${classes.icons}">
                                                <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                        $('body').after(mainHtml);
                        self.generateSlices();
                    };

                    self.generateSlices = () => {
                        const { slice, sliceText } = classes;

                        $(selectors.slices).html('');

                        variables.addedSliceNames.forEach((entity, index) => {
                            const angle = (360 / variables.addedSliceNames.length) * index;

                            $(selectors.slices).append($('<div>').attr('data-id', entity.id).addClass(slice).css({
                                transform: `rotate(${angle}deg)`,
                                borderWidth: `${config.radius}px 
                                ${self.calculateSliceWidth(variables.addedSliceNames.length)}px 0`,
                                borderColor: `${entity.color} transparent`,
                                transformOrigin: 'center bottom',
                            }).append($('<div>').text(entity.name).addClass(sliceText).css({
                                color: self.findDarkColor(entity.color) ? '#000' : '#FFF',
                            })));
                        });
                    };

                    self.calculateSliceWidth = (totalSlices) => {
                        const specialCases = { 1: 360, 2: 180, 3: 120, 4: 90 * 2, 5: 90 * 1.5 };

                        return specialCases[totalSlices] || 90 * (7 / totalSlices);
                    };

                    self.remakeSlicesWidth = () => {
                        const slicesCount = variables.addedSliceNames.length;

                        if (slicesCount === 1) {
                            variables.addedSliceNames.forEach((entity, index) => {
                                $(selectors.slice).eq(index).css({
                                    borderWidth: '360px 180px 0',
                                    borderColor: `${entity.color} transparent`,
                                    background: `${entity.color}`,
                                    clipPath: 'none'
                                });

                                $(selectors.sliceText).eq(index).css({
                                    margin: '20px 0',
                                    transform: 'translateX(-50%) rotate(90deg)',
                                });
                            });
                        }

                        if (slicesCount === 2) {
                            variables.addedSliceNames.forEach((entity, index) => {
                                $(selectors.slice).eq(index).css({
                                    borderWidth: '180px 180px 0',
                                    borderColor: `${entity.color} transparent`,
                                    background: `${entity.color}`,
                                    clipPath: 'none'
                                });

                                $(selectors.sliceText).eq(index).css({
                                    margin: '0',
                                    transform: 'translateX(-50%) rotate(90deg)',
                                });
                            });
                        }

                        if (slicesCount === 3) {
                            variables.addedSliceNames.forEach((entity, index) => {
                                $(selectors.slice).eq(index).css({
                                    borderWidth: '180px 180px 0',
                                    borderColor: `${entity.color} transparent`,
                                    background: `${entity.color}`,
                                    clipPath: 'polygon(100% 0% , 50% 100% , -140% 0)',
                                });

                                $(selectors.sliceText).eq(index).css({
                                    margin: '5px -20px',
                                    transform: 'translateX(-50%) rotate(80deg)',
                                });
                            });
                        }

                        self.calculateTextFontSize();
                    };

                    self.getRandomColor = () => {
                        const letters = '0123456789ABCDEF';
                        let color = '#';

                        [...Array(6)].forEach(() => {
                            color += letters[Math.floor(Math.random() * 16)];
                        });

                        return color;
                    };

                    self.findDarkColor = (color) => {
                        const fixingColor = color.replace('#', '');
                        const r = parseInt(fixingColor.substring(0, 2), 16);
                        const g = parseInt(fixingColor.substring(2, 4), 16);
                        const b = parseInt(fixingColor.substring(4, 6), 16);

                        return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
                    };

                    self.setEvents = () => {
                        const { spinStartButton, sliceContainer,
                            winnerPopup, winnerPopupContainer,
                            slice, winnerPopupClose } = selectors;

                        const { startButtonDisabled, winnerPopupShow, winnerText } = classes;

                        const { confetti, isAnimation, rotationTime } = config;

                        $(spinStartButton).on('click', () => {
                            let isRotating = false;

                            $(sliceContainer).css('animation', 'none');

                            if (!isRotating) {
                                self.setSpinToWheel();
                                isRotating = true;

                                $(spinStartButton).addClass(startButtonDisabled);

                                setTimeout(() => {
                                    if (isRotating) {
                                        $(winnerPopupContainer).addClass(winnerPopupShow);
                                        insertGameWinner(selectedSegment)
                                        console.log(selectedSegment, "selectedSegment")
                                        $(winnerPopup).append($('<div>').text(variables.selectedText).addClass(winnerText));

                                        $(spinStartButton).removeClass(startButtonDisabled);

                                        if (confetti) {
                                            self.getAnimationData();
                                        }

                                        if (isAnimation) {
                                            $(sliceContainer).css('animation', 'rotate 20s infinite linear');
                                        }


                                        self.deleteSelectedSlice();
                                    }

                                    self.calculateTextFontSize();
                                }, (rotationTime + 1) * 1000);

                            }
                        });

                        $(winnerPopupClose).on('click', () => {
                            $(winnerPopupContainer).removeClass(classes.winnerPopupShow);
                            $(selectors.winnerText).html('');
                        });

                        $(selectors.wrapper).on('click', (e) => {
                            if ($(e.target).hasClass(winnerPopupShow)) {
                                $(winnerPopupContainer).removeClass(winnerPopupShow);
                                $(selectors.winnerText).html('');
                            }
                        });

                    };

                    self.dynamicSliceDeleteEvent = () => {
                        const { dynamicSliceTextDelete } = selectors;

                        $(dynamicSliceTextDelete).on('click', (e) => {
                            self.deleteSelectedText(e.currentTarget);
                        });
                    };

                    self.deleteSelectedText = (element) => {
                        const { slice } = selectors;


                        const deletedId = $(element).parent().data('id');

                        variables.addedSliceNames.sort((a, b) => a - b);

                        variables.addedSliceNames =
                            variables.addedSliceNames.filter((entity) => entity.id !== deletedId);

                        $(`${slice}[data-id="${deletedId}"]`).remove();
                        $(element).parent().remove();

                        variables.addedSliceNames.forEach((entity, index) => {
                            const angle = (360 / variables.addedSliceNames.length) * index;

                            $(slice).eq(index).css({
                                transform: `rotate(${angle}deg)`,
                                borderColor: `${entity.color} transparent`,
                                borderWidth: `${config.radius}px 
                                    ${self.calculateSliceWidth(variables.addedSliceNames.length)}px 0`,
                                transformOrigin: 'center bottom',
                            });

                            $(selectors.sliceText).eq(index).css({
                                color: self.findDarkColor(entity.color) ? '#000' : '#FFF',
                            });
                        });

                        if (variables.addedSliceNames.length === 0) {
                            self.createFakeSlice();
                        }

                        self.setSliceNameAtLists();
                        self.calculateTextFontSize();
                        self.remakeSlicesWidth();
                        self.dynamicSliceDeleteEvent();
                    };

                    self.setSpinToWheel = () => {
                        const { spinStopper, spinStopperContainer, sliceContainer } = selectors;
                        const { stopperUp, rotateCount, rotationTime } = config;

                        const calculateStoperValue = self.calculatespinStopperValue(config.stopperDirection);
                        const selectorName = $(stopperUp ? spinStopper : spinStopperContainer);
                        const rotationValue = calculateStoperValue + (self.getRotationValue(selectorName));
                        const fakeRotate = 360 * rotateCount;
                        const randomValueForRotate = self.setRandomRotateValue();
                        const calculateSliceCountRngNumber = self.getRandomNumber(1, (variables.addedSliceNames.length * 2));

                        const transformValue = `rotate(${fakeRotate + rotationValue + randomValueForRotate +
                            calculateSliceCountRngNumber}deg)`;

                        $(sliceContainer).css('transition', `transform ${rotationTime}s ease`)
                            .css('transform', transformValue);
                    };

                    self.getRotationValue = (element) => {
                        const transform = $(element).css('transform');
                        const matrix = transform.split('(')[1].split(')')[0].split(',');
                        const rotate = 360 - Math.round(Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI));

                        return rotate;
                    };

                    self.calculatespinStopperValue = (stoperName) => {
                        if ((stoperName === 'top' || stoperName === 'bottom')) {
                            return config.stopperUp ? 360 : 180;
                        } else if ((stoperName === 'left' || stoperName === 'right')) {
                            return config.stopperUp ? 180 : 360;
                        }

                        return 0;
                    };

                    self.getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
                    self.setRandomRotateValue = () => {
                        const { slice, } = selectors;

                        variables.slicesRotate = [];
                        variables.slicesText = [];

                        variables.addedSliceNames.forEach((entity, index) => {
                            const sliceRotate = self.getRotationValue($(slice).eq(index));
                            const sliceText = entity.name;

                            variables.slicesRotate.push(sliceRotate);
                            variables.slicesText.push(sliceText);
                        });


                        function getRandomItemByChance(arr) {
                            // Toplam chance_ratio'yu hesapla
                            const totalChance = arr.reduce((sum, item) => sum + item.chance_ratio, 0);

                            // 0 ile toplam chance_ratio arasındaki rastgele bir sayı seç
                            const random = Math.random() * totalChance;

                            let sum = 0;

                            // Chance_ratio'yu kontrol ederek uygun elemanı seç
                            for (let i = 0; i < arr.length; i++) {
                                sum += arr[i].chance_ratio;
                                if (random <= sum) {
                                    return { ...arr[i], index: i }; // Seçilen öğe ile index bilgisini döndür
                                }
                            }
                        }

                        const selected = getRandomItemByChance(gameSettings);

                        selectedSegment = selected;
                        const sliceRotate = variables.slicesRotate[selected.index]
                        const selectedSliceBackground = $(slice).eq(variables.slicesRotate.indexOf(sliceRotate)).css('border-color');
                        const selectedSliceTextColor = $(slice).eq(variables.slicesRotate.indexOf(sliceRotate)).find(selectors.sliceText).css('color');

                        $(selectors.winnerHeader).css('background', self.rgbaToHex(selectedSliceBackground.replace('rgba(0, 0, 0, 0)', '')));
                        $(selectors.winnerIcon).css('color', selectedSliceTextColor);
                        $(selectors.winnerHeader).css('color', selectedSliceTextColor);
                        $(selectors.winnerPopupClose).css('color', selectedSliceTextColor);
                        variables.selectedText = variables.slicesText[selected.index]


                        return sliceRotate;
                    };

                    self.rgbaToHex = (color) => {
                        const rgba = color.match(/\d+/g);

                        return `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2]))
                            .toString(16).slice(1)}`;
                    };

                    self.calculateTextFontSize = () => {
                        const fontSize = [];

                        variables.addedSliceNames.forEach((entity, index) => {
                            if (entity.name.length >= 12) {
                                fontSize.push((100 / entity.name.length) * 2.5);
                            } else {
                                fontSize.push(20);
                            }

                            $(selectors.sliceText).eq(index).css('font-size', `${fontSize[index]}px`);
                        });
                    };

                    self.addSlice = (sliceName) => {
                        const { dynamicWinRate } = selectors;
                        const id = (variables.addedSliceNames[variables.addedSliceNames.length - 1]?.id || 0) + 1;

                        $(dynamicWinRate).remove();

                        variables.addedSliceNames.push(
                            {
                                name: sliceName.toLowerCase(),
                                id,
                                color: self.getRandomColor(),
                            }
                        );

                        self.generateSlices(variables.addedSliceNames.length + 1);

                        $(dynamicWinRate).text(`WinRate: ${self.calculateWinRate()}`);

                        self.dynamicSliceDeleteEvent();
                    };

                    self.getAnimationData = () => {
                        $.ajax({
                            url: 'https://gist.githubusercontent.com/EnesKabakaya1/4759c137883e6a4efefdb18108919bf3/raw/13585f9aa94441edbc103f2aea07990362b06753/gistfile1.txt',
                            method: 'GET',
                            dataType: 'json',
                            charset: 'UTF-8',
                            success(data) {
                                window.wheelOfFortuneAnimation = data;

                                self.getLottieLibrary();
                            }, error() {
                                console.error('Lottie animation data not loaded!');
                            }
                        });
                    };

                    self.getLottieLibrary = () => {
                        $.ajax({
                            url: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.4/lottie.min.js',
                            method: 'GET',
                            dataType: 'script',
                            charset: 'UTF-8',
                            success() {
                                window.wheelOfFortuneAnimation = window.bodymovin.loadAnimation({
                                    container: $(selectors.wrapper)[0],
                                    renderer: 'svg',
                                    loop: true,
                                    autoplay: true,
                                    animationData: window.wheelOfFortuneAnimation,
                                });

                                $(selectors.wrapper).on('click', () => {
                                    $(selectors.wrapper).find(`svg:not(${selectors.icons})`).remove();
                                });
                            }, error() {
                                console.error('Lottie library not loaded!');
                            }
                        });
                    };

                    self.calculateWinRate = () => {
                        const winRate = (100 / variables.addedSliceNames.length) || 0;

                        return `${winRate.toFixed(2)}%`;
                    };

                    self.setSliceNameAtLists = () => {

                        if (variables.addedSliceNames.length > 0) {
                            $(selectors.dynamicWinRate).text(`WinRate: ${self.calculateWinRate()}`);
                        }
                    };

                    self.getSlicesLocal = () => {
                        const slicesTextLocal = JSON.parse(localStorage.getItem('added-slices')) || [];

                        if (slicesTextLocal.length > 0) {

                            variables.addedSliceNames = [];

                            slicesTextLocal.forEach((entity) => {
                                variables.addedSliceNames.push(entity);
                            });

                            self.setSliceNameAtLists();
                            self.calculateTextFontSize();
                            self.generateSlices(slicesTextLocal.length);
                            self.remakeSlicesWidth();
                            self.dynamicSliceDeleteEvent();
                        } else {
                            self.createFakeSlice();
                        }
                    };

                    self.createFakeSlice = () => {
                        const getRandomColor = self.getRandomColor();

                        $(selectors.slices).append($('<div>').attr('data-name', 'dummy').addClass(classes.slice).css({
                            borderWidth: '360px 180px 0',
                            borderColor: `${getRandomColor} transparent`,
                            background: `${getRandomColor}`,
                            clipPath: 'none'
                        }).append($('<div>').addClass(classes.fakeSliceText).text('Please Add Person').css({
                            color: self.findDarkColor(getRandomColor) ? '#000' : '#FFF',
                            margin: '-170px 0px',
                            transform: 'translateX(-50%) rotate(0deg)',
                            fontSize: '25px',
                        })));

                        $(selectors.spinStartButton).addClass(classes.startButtonDisabled);
                    };

                    self.deleteSelectedSlice = () => {
                        self.setSliceNameAtLists();
                        self.remakeSlicesWidth();
                        self.dynamicSliceDeleteEvent();
                        self.resetSlicesRotate();

                        if (variables.addedSliceNames.length === 0) {
                            self.createFakeSlice();
                        }
                    };

                    self.resetSlicesRotate = () => {
                        $(selectors.sliceContainer).css('transition', 'none').css('transform', 'rotate(0deg)');

                        variables.slicesRotate.length = 0;
                        variables.slicesText.length = 0;
                        variables.selectedText = '';
                    };

                    gameSettings.forEach(setting => {
                        if (setting.part_name.trim()) { // part_name'in geçerli olup olmadığını kontrol et
                            self.addSlice(setting.part_name.trim());
                        }
                    });

                    // Slice genişliklerini yeniden hesapla
                    self.remakeSlicesWidth();
                    self.init(true);
                });
            })(jQuery);
        }).catch((error) => {
            console.error('Script Loading Error:', error);
        });

    }, [gameSettings])
    return (
        <div>

        </div>
    )
}