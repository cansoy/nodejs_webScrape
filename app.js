const path =require('path')
const fs=require('fs')
const cheerio=require('cheerio')
const express=require('express')
const axios=require('axios').default
const xlsx=require('excel4node')
const app=express()

const myUserAPi=async()=>{
    const url='https://jsonplaceholder.typicode.com/users'
    const response=await axios.get(url)
    const apiData=response.data
    const jsonData=JSON.stringify(apiData)
    try {
        fs.appendFile('./userapi.txt',jsonData,err=>{
            console.log(err)
        })
    } catch (error) {
        console.log(error)
    }
}

const amazonPageApi=async()=>{
    const myAmazonItems=[]
    for (let index = 0; index < 4; index++) {
        const url=`https://www.amazon.com.tr/gp/new-releases/electronics/13709880031/ref=zg_bsnr_pg_1?ie=UTF8&pg=${index}`
        const response=await axios.get(url)
        const htmlData=response.data
        const $=cheerio.load(htmlData)
        const items=$('div[id=gridItemRoot]')
        items.each((i,el)=>{
            const index=i
            const title=$(el).find('img').attr('alt')
            const src=$(el).find('img').attr('src')
            const price=$(el).find('span[class=_cDEzb_p13n-sc-price_3mJ9Z]').text()
            myAmazonItems.push({index,title,src,price})
        })
    }
    const wb=new xlsx.Workbook()
    const ws = wb.addWorksheet('Sheet_1');
    myAmazonItems.forEach((item,index)=>{
        ws.cell(index+1,1).number(index)
        ws.cell(index+1,2).string(item.title)
        ws.cell(index+1,3).string(item.src)
        ws.cell(index+1,4).string(item.price)
    })
    wb.write('myExcel.xlsx')
}
amazonPageApi()
myUserAPi()

app.listen(3000,()=>{
    console.log('............................................')
})