import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND} from '../../../brand/brand';

export const ThumbnailIntelligentUI: React.FC = () =>
  <AbsoluteFill style={{
    background:'radial-gradient(circle at 70% 42%,#FFFFFF 0%,#FCF9FD 48%,#EEE6F8 100%)',
    color:BRAND.ink,fontFamily:BRAND.font,overflow:'hidden'
  }}>
    <div style={{position:'absolute',left:70,top:85,fontSize:113,fontWeight:950,letterSpacing:-6,lineHeight:1}}>
      <span>TEXT</span><span style={{color:BRAND.accentDk,padding:'0 36px'}}>→</span><span>TOOL</span>
    </div>
    <div style={{position:'absolute',left:98,top:290,width:655,height:600,transform:'rotate(-6deg)'}}>
      <div style={{fontSize:30,color:'#6C6380',fontWeight:900,marginBottom:32}}>DIE ALTE ANTWORT</div>
      {Array.from({length:7},(_,i)=><div key={i} style={{
        height:33,width:(390+(i%3)*75)+'px',background:'#BCB5C8',borderRadius:20,marginBottom:37
      }}/>)}
      <div style={{fontSize:40,fontWeight:950,color:'#756E7F'}}>Nur Text ...</div>
    </div>
    <div style={{position:'absolute',left:755,top:332,width:1030,height:585,borderRadius:56,
      background:'#fff',border:'7px solid #DAC6EF',transform:'rotate(3deg)',boxShadow:'0 30px 100px rgba(69,33,111,.21)'}}>
      <div style={{padding:'45px 60px',fontSize:37,fontWeight:900,color:BRAND.accentDk}}>INTERAKTIVES BEISPIEL</div>
      <div style={{padding:'10px 64px',fontSize:61,fontWeight:950}}>Was passiert, wenn ...?</div>
      <div style={{position:'absolute',left:80,top:255,width:800,height:28,borderRadius:20,background:'#E4D8F4'}}>
        <div style={{width:580,height:28,borderRadius:20,background:BRAND.accent}}/>
        <div style={{position:'absolute',left:545,top:-19,width:69,height:69,borderRadius:45,background:BRAND.accentDk,border:'10px solid white'}}/>
      </div>
      <div style={{position:'absolute',bottom:50,left:70,fontSize:105,fontWeight:950,letterSpacing:-4,color:BRAND.accentDk}}>200 € <span style={{color:'#15936E'}}>→ 300 €</span></div>
    </div>
    <div style={{position:'absolute',right:80,bottom:35,fontSize:22,fontWeight:900,color:'#766B86'}}>SCHEMATISCH · GPT-6 INTELLIGENT UI</div>
  </AbsoluteFill>;
