import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageSettings from "../page_settings/page_settings";
import { useSelector } from 'react-redux';
import { FocusContext } from '../../../src/context/FocusContext';

import './search_panel.scss';

export default function SearchPanel() {
    const navigate = useNavigate();

    //const userid = useSelector(state => state.user.userId);
    const userData = useSelector(state => state.user.userData);

    const [search, setSearch] = useState({ searchText: '' });
    const [showPageSettings, setShowPageSettings] = useState(false);
    const [icon, setIcon] = useState("http://172.24.80.146/images/1.webp");
    const [showSearchPanelHelper, setShowSearchPanel] = useState(false);

    const [searchDimensions, setSearchDimensions] = useState({ searchMarginWidth: 0, searchMarginHeight: 0, searchPanelWidth: 0 });

    const ProfileRef = useRef(null);

    const { inputRef } = useContext(FocusContext);

    const [isDisabled, setIsDisabled] = useState(true);

    const [searchArray, setSearchArray] = useState([
        "Данная функция находится в разработке."
    ]);

    const handleSearchChange = (e) => {
        e.target.value !== "" ? setShowSearchPanel(true) : setShowSearchPanel(false);
        setSearch({ searchText: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const encSearch = encodeURIComponent(search.searchText);
        setShowSearchPanel(false);
        //console.log(`encode text: ${encSearch}`);
        !isDisabled && navigate(`/search?sr=${encSearch}`);
    };

    const setShowSettings = () => {
        setShowPageSettings(!showPageSettings);
    }

    const handleClickOutside = (e) => {
        if (ProfileRef.current && !ProfileRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
            setShowPageSettings(false);
            setShowSearchPanel(false);
        }
    };

    const toggleshowSearchPanelHelper = () => {
        setShowSearchPanel(!showSearchPanelHelper);
    }

    const handleFocus = (e) => {
        e.target.value !== "" ? setShowSearchPanel(true) : setShowSearchPanel(false);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowSearchPanel(false);
        }, 100);
    };

    useEffect(() => {
        //console.log(`search_panel: ${userid}`);

        if(userData && userData.face){
            const userFace = userData.face;
            setIcon(`http://172.24.80.146/images/${userFace.coverID}.webp`);
        }

        document.addEventListener('mousedown', handleClickOutside);

        const handleResize = () => {
            setSearchDimensions({
                searchMarginHeight: document.querySelector('.upper_panel')?.clientHeight || 0,
                searchPanelWidth: document.querySelector('.search_container_panel')?.clientWidth || 0
            });
        }

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleAddToSearchPanel = (value) => {
        setSearch({ searchText: value });
    }

    const panelHeight = {
        marginTop: `${searchDimensions.searchMarginHeight}px`,
        width: `calc(${searchDimensions.searchPanelWidth}px + 61px)`
    };


    return (
        <>
            <div className={`upper_panel`} style={showSearchPanelHelper ? { borderBottomLeftRadius: "0px" } : {}}>
                <div className="panel_inside">
                    <div className="panel_inside search_panel">
                        <form onSubmit={handleSearch} className="search_container_panel" disabled={isDisabled}>
                            <input
                                ref={inputRef}
                                className={`panel_inside search_panel searchInput ${showSearchPanelHelper ? "input-search-clicked" : ""}`}
                                type="text"
                                name="search"
                                placeholder="Поиск треков, плейлистов, альбомов"
                                value={search.searchText}
                                onChange={handleSearchChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            //onClick={toggleshowSearchPanelHelper}
                            />
                        </form>
                    </div>
                    <button className="panel_inside user_icon user_icon_container" onClick={setShowSettings}>
                        <img src={icon} className="panel_inside user_icon user_icon_image"></img> {/*onError={(e) => e.target.src = "https://cdni.iconscout.com/illustration/premium/thumb/404-7304110-5974976.png?f=webp"}*/}
                    </button>
                </div>
            </div>
            <PageSettings isEnable={showPageSettings} Pref={ProfileRef} />
            {showSearchPanelHelper ?
                <>
                    {searchArray.length !== 0 ?
                        <div className="searchPanel__search-container" style={panelHeight}>
                            {searchArray.map((search, index) => {
                                let buttonStyle = '';
                                if (index === 0) {
                                    buttonStyle = 's-upper';
                                } else if (index === searchArray.length - 1) {
                                    buttonStyle = 's-downer';
                                } else {
                                    buttonStyle = 's-middle';
                                }

                                return (
                                    <button key={index} className={`searchPanel__search-buttons ${buttonStyle}`} onClick={() => handleAddToSearchPanel(search)} disabled={isDisabled}>
                                        {search}
                                    </button>
                                );
                            })}
                        </div>
                        :
                        <></>
                    }
                </>
                :
                <></>}
        </>
    );
}
