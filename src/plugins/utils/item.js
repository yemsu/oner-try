import { deepClone, getOnlyText, objArrKeys } from "@/plugins/utils";
import {
  gradeScoresDef,
  itemTypeDefs,
  gradesDef,
} from "@/plugins/utils/item-def";

export const findData = (dataList, key, checkValue) => {
  return dataList.find(
    (data) => getOnlyText(data[key]) === getOnlyText(checkValue)
  );
};
export const imgSrc = (type, imageName) => {
  if (!type) return "";
  return `/images/items/${type}/${imageName}.png`;
};
export const getGradeScore = (key) => {
  return gradeScoresDef[key] || key;
};
export const sortByGrade = (items) => {
  return items.sort((a, b) => getGradeScore(b.grade) - getGradeScore(a.grade));
};
export const parserStrData = (strData, type = "object") => {
  // name: value, name: value ...
  if (!strData) return [];
  if (typeof strData !== "string") return strData;
  const checkSingle = !strData.includes(",");
  const data = checkSingle
    ? [strData]
    : strData.replace(/\[ | \]/, "").split(",");
  const objList = data.map((str) => {
    if (type === "list") return str.trim();
    const splitStr = str.split(":");
    const nameValue = getOnlyText(splitStr[0]);
    return { [nameValue]: splitStr[1] };
  });

  return objList;
};
export const parserStrDataToObj = (strData) => {
  // name: value, name: value ...
  if (!strData) return {};
  if (typeof strData !== "string") {
    console.error(
      "parserStrDataToObj : 인수 타입이 string이여야 합니다!",
      strData
    );
    return strData;
  }
  const result = strData.split(",").reduce((result, strOption) => {
    const key = strOption.split(": ")[0];
    const value = strOption.split(": ")[1];
    result[key] = value;
    return result;
  }, {});

  return result;
};
export const fillDataAndInsertValue = (
  fullDataList,
  targetDataList,
  newDataKey,
  useDefaultData
) => {
  // console.log('fillDataAndInsertValue', fullDataList, targetDataList, newDataKey, useDefaultData)
  const names = objArrKeys(targetDataList);
  const newData = names.map((name, i) => {
    const data = targetDataList[i];
    if (isBlank(name)) return null;
    const fullData =
      findData(fullDataList, "name", name) ||
      findData(fullDataList, "id", name);
    if (!fullData) {
      console.error(`NO ITEM: ${name} - CHECK DB!`);
      if (!useDefaultData) return false;
    }
    const defaultData = { name };
    const fullDataClone = deepClone(fullData || defaultData);

    if (fullDataClone.option && typeof fullDataClone.option === "string") {
      fullDataClone.option = parserStrData(fullDataClone.option);
    }

    const itemValue = Object.values(data)[0];
    const isString = typeof itemValue === "string";
    const newObj = { [newDataKey]: isString ? itemValue.trim() : itemValue };
    return Object.assign(fullDataClone, newObj);
  });

  return newData;
};
export const isBlank = (str) => str.includes("빈공간");
export const parserDefaultData = (data) => {
  return isBlank(data) ? `${data}: null` : data;
};
export const fillDefaultList = (items, numberFixed) => {
  const newItems = [...items];
  const length = newItems.length;
  if (length >= numberFixed) return items;
  const defaultArr = new Array(numberFixed - length).fill(null);
  newItems.push(...defaultArr);

  return newItems;
};
export const getTypeKorName = (typeEngName) => {
  return itemTypeDefs.find(({ type }) => type === typeEngName).title;
};
export const itemFilterOptions = (itemGradeArr, optionsObj) => {
  const commonMenu = { id: "all", text: "ALL" };

  let gradeMenus = null;
  if (itemGradeArr) {
    const gradeMenu = itemGradeArr.map((key) => ({
      id: key,
      text: gradesDef[key],
    }));
    gradeMenus = [commonMenu, ...gradeMenu];
  }

  let optionMenus = null;
  if (optionsObj) {
    const optionMenu = Object.keys(optionsObj).map((key) => ({
      id: key,
      text: optionsObj[key],
    }));
    optionMenus = [commonMenu, ...optionMenu];
  }

  return {
    gradeMenus,
    optionMenus,
  };
};
export const parserGradeOption = (gradeOption) => {
  if (!gradeOption) return null;
  return gradeOption
    .replace(/(\, \[)|(\,\[)/g, " [")
    .replace(/ \[/g, ", [")
    .replace(/\]/g, "] ")
    .split(", ");
};
