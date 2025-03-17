import AsyncStorage from "@react-native-async-storage/async-storage";

const saveImages = async () => {
    try {
        const blogImages = {
            1: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741160743/MindSpace/pwxznex6nhrdtxi13xdu.png",
            2: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741160742/MindSpace/uqrvpvgaiicyf7fyxwxo.png",
        };
        const articleImages = {
            3: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741160741/MindSpace/y8rtvec5cqay38vo9ok3.png",
            4: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741160741/MindSpace/sjmiue4s5l4ligvcxo5w.png",
            1002: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741160741/MindSpace/pz822fsboihzcme8bjcx.png"
        }
        const supportingProgramImages = {
            1: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741961026/nl98cepyq79riihxswg8.jpg",
            2: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741961019/jvtbn23bgp2bjamxjsga.jpg",
            3: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741961016/sb6aqngwbks1x1yx9qec.jpg",
            4: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741961014/bmah07wzxzscvxgrropz.jpg",
            5: "https://res.cloudinary.com/dhaltx1cv/image/upload/v1741960995/spwz5y6t587w9htcgkfv.jpg",
        }
        await AsyncStorage.setItem("supportingProgramImages", JSON.stringify(supportingProgramImages));
        await AsyncStorage.setItem("blogImages", JSON.stringify(blogImages));
        await AsyncStorage.setItem("articleImages", JSON.stringify(articleImages));
        console.log("Blog images saved successfully!");
    } catch (error) {
        console.error("Failed to save blog images", error);
    }
};

saveImages();
