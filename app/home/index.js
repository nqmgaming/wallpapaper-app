import React, {useRef, useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Feather, FontAwesome6, Ionicons} from '@expo/vector-icons';
import {theme} from "../../constants/theme";
import {hp, wp} from "../../helpers/common";
import Categories from "../../components/categories";
import {apiCall} from "../../api";
import ImageGrid from "../../components/imageGrid";
import {debounce} from 'lodash';
import FiltersModal from "../../components/filtersModal";
import {useRouter} from "expo-router";

var page = 1;
const HomeScreen = () => {
    const {top} = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState("");
    const searchInputRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [images, setImages] = useState([]);
    const modelRef = useRef(null);
    const [filters, setFilters] = useState(null);
    const scrollRef = useRef(null);
    const [isEndReached, setIsEndReached] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async (params = {page: 1}, append = true) => {
        console.log(`Params: ${JSON.stringify(params)}`);
        let res = await apiCall(params);

        if (res.success && res?.data?.hits) {
            if (append) {
                setImages([...images, ...res.data.hits]);
            } else {
                setImages([...res.data.hits])
            }
        }

    }

    const handleSearch = (text) => {
        setSearch(text)
        if (text.length > 2) {
            // search for this text
            page = 1;
            setImages([]);
            setActiveCategory(null)
            fetchImages({page, q: text, ...filters}, false);
        }
        if (text === "") {
            // reset result
            page = 1;
            searchInputRef?.current?.clear();
            setImages([]);
            setActiveCategory(null)
            fetchImages({page, filters}, false);
        }

    }

    const clearSearch = () => {
        setSearch("");
    }

    const handleScroll= (event) => {
       const contentHeight = event.nativeEvent.contentSize.height;
       const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
       const scrollOffset = event.nativeEvent.contentOffset.y;
       const bottomPosition = contentHeight - scrollViewHeight;

       if(scrollOffset>=bottomPosition-1) {

           if (!isEndReached){
               setIsEndReached(true)
               console.log("reached the bottom of scrollview");
               // fetch more image
               ++page;
               let params ={
                   page,
                   ...filters
               }
               if (activeCategory){
                   params.category = activeCategory;
               };
               if (search){
                   params.q = search;
               };
               fetchImages(params, true);
           }
       }else if(isEndReached) {
           setIsEndReached(false);
       }
    }

    const handleScrollUp = () => {
        scrollRef?.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])

    const openFiltersModal = () => {
        modelRef?.current.present();
    }

    const closeFilterModal = () => {
        modelRef?.current.close();
    }

    const applyFilters = () => {
        console.log(`Apply filters: ${filters}`);
        if (filters) {
            page = 1;
            setImages([]);
            let params = {
                page,
                ...filters
            };
            if (activeCategory) params.category = activeCategory;
            if (search) {
                params.q = search
            }
            fetchImages(params, false)
        }
        closeFilterModal();
    }
    const resetFilters = () => {
        if (filters) {
            page = 1;
            setFilters(null);
            setImages([]);
            let params = {
                page
            };
            if (activeCategory) params.category = activeCategory;
            if (search) {
                params.q = search
            }
            fetchImages(params, false)
        }
        closeFilterModal();
    }

    const clearThisFilter = (filterName) => {
        let filterz = {...filters};
        delete filterz[filterName];
        setFilters({...filterz})
        page = 1;
        setImages([]);
        let params = {
            page,
            ...filterz
        }
        if (activeCategory) params.category = activeCategory;
        if (search) {
            params.q = search
        }
        fetchImages(params, false)
    }

    const handleChangeCategory = (category) => {
        setActiveCategory(category);
        clearSearch();
        setImages([]);
        page = 1;
        let params = {
            page,
            ...filters
        }

        if (category) {
            params.category = category;
        }
        fetchImages(params, false)
    };

    return (
        <View style={[styles.container, {paddingTop}]}>
            {/*  Header  */}
            <View style={styles.header}>
                <Pressable
                    onPress={handleScrollUp}
                >
                    <Text style={styles.title}>
                        Pixels
                    </Text>
                </Pressable>
                <Pressable onPress={openFiltersModal}>
                    <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)}/>
                </Pressable>
            </View>
            <ScrollView
                contentContainerStyle={{gap: 15}}
                onScroll={handleScroll}
                scrollEventThrottle={5}
                ref={scrollRef}
            >
                {/*    Searchbar */}
                <View style={styles.searchbar}>
                    <View style={styles.searchIcon}>
                        <Feather name="search" size={24} color={theme.colors.neutral(0.4)}/>
                    </View>
                    <TextInput placeholder='Search for photos...'
                               style={styles.searchInput}
                               ref={searchInputRef}
                               onChangeText={handleTextDebounce}
                    />
                    {search && (
                        <Pressable
                            onPress={() => handleSearch("")}
                            style={styles.closeIcon}>
                            <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)}/>
                        </Pressable>
                    )}
                </View>
                {/*    Categories*/}
                <View style={styles.categories}>
                    <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory}/>
                </View>
                {/* filter */}
                {
                    filters && (
                        <View style={styles.filter}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.filters}>
                                {
                                    Object.keys(filters).map((key, index) => {
                                        return (
                                            <View key={index}>
                                                <View key={index} style={styles.filterItem}>
                                                    {
                                                        key=='colors' ? (
                                                            <View key={index} style={{height: hp(2.22),width: 30, borderRadius: 7, backgroundColor: filters[key]}}>
                                                            </View>
                                                        ): (
                                                            <Text key={index} style={styles.filterItemText}>
                                                                {filters[key]}
                                                            </Text>
                                                        )
                                                    }

                                                    <Pressable style={styles.filterCloseIcon}
                                                               onPress={() => clearThisFilter(key)}>
                                                        <Ionicons name="close" size={14} color={theme.colors.neutral(0.9)}/>

                                                    </Pressable>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    )
                }
                {/*    images masony grid */}
                <View>
                    {images.length > 0 && <ImageGrid images={images} router={router}/>}
                </View>
                {/*    loading */}
                <View style={{marginTop: images.length > 0 ? 10 : 70, marginBottom: 70}}>
                    <ActivityIndicator size={"large"}/>
                </View>
            </ScrollView>
            {/*    filter mdel*/}
            <FiltersModal
                modalRef={modelRef}
                filters={filters}
                setFilters={setFilters}
                onClose={closeFilterModal}
                onApply={applyFilters}
                onReset={resetFilters}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semiBold,
        color: theme.colors.neutral(0.9),
    },
    searchbar: {
        flexDirection: 'row',
        marginHorizontal: wp(4),
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.lg

    },
    searchIcon: {
        padding: 8
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.sm,
        paddingVertical: 10,
        fontSize: hp(1.8)
    },
    closeIcon: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 8,
        borderRadius: theme.radius.sm
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10
    },
    filterItem: {
        backgroundColor: theme.colors.grayBG,
        flexDirection: "row",
        borderRadius: theme.radius.xs,
        padding: 8,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },
    filterItemText: {
        fontSize: hp(1.9)
    },
    filterCloseIcon: {
        backgroundColor: theme.colors.neutral(0.2),
        padding: 4,
        borderRadius: 7
    }
});

export default HomeScreen;
