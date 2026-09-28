import React from 'react';
import {AbsoluteFill,Easing,Sequence,interpolate,useCurrentFrame} from 'remotion';
import {CHANNEL_ART_DIRECTION as AD} from '../visual-system/channelArtDirection';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ease=(frame:number,from:number,to:number)=>interpolate(frame,[from,Math.max(from+1,to)],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});

const StudioGround:React.FC<{dark?:boolean}>=({dark=false})=><AbsoluteFill style={{background:dark?'linear-gradient(180deg,#17151B,#0F0E13)':'linear-gradient(180deg,#FBFAF7,#F3F0EA)',overflow:'hidden'}}>
  <div style={{position:'absolute',left:90,right:90,top:1180,height:300,borderRadius:'50%',background:dark?'rgba(255,255,255,.035)':'rgba(26,24,32,.045)',filter:'blur(18px)',transform:'scaleY(.32)'}}/>
</AbsoluteFill>;

const SceneTag:React.FC<{index:string;title:string;dark?:boolean}>=({index,title,dark=false})=><div style={{position:'absolute',left:78,top:82,zIndex:30,display:'flex',alignItems:'baseline',gap:18,color:dark?'#F7F3ED':AD.palette.graphite}}><span style={{fontSize:18,fontWeight:800,letterSpacing:4,opacity:.48}}>{index}</span><span style={{fontSize:28,fontWeight:900,letterSpacing:1.2}}>{title}</span></div>;

const CeramicCore:React.FC<{x:number;y:number;size:number;rotation?:number;dark?:boolean}>=({x,y,size,rotation=0,dark=false})=><div style={{position:'absolute',left:x,top:y,width:size,height:size,perspective:900}}>
  <div style={{position:'absolute',inset:0,borderRadius:'34% 34% 42% 42%',background:dark?'linear-gradient(145deg,#3A3642,#17151C 70%)':'linear-gradient(145deg,#FFFFFF,#DDD8D0 72%)',border:dark?'1px solid rgba(255,255,255,.08)':'1px solid rgba(26,24,32,.08)',boxShadow:dark?'0 55px 120px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.12)':'0 55px 120px rgba(42,35,28,.18),inset 0 1px 0 rgba(255,255,255,.9)',transform:`rotate(${rotation}deg) rotateX(8deg) rotateY(-10deg)`}}/>
  <div style={{position:'absolute',left:'18%',right:'18%',top:'44%',height:6,borderRadius:5,background:AD.palette.purple,opacity:.72}}/>
</div>;

const AcrylicTile:React.FC<{x:number;y:number;width:number;height:number;rotate?:number;opacity?:number}>=({x,y,width,height,rotate=0,opacity=1})=><div style={{position:'absolute',left:x,top:y,width,height,borderRadius:18,background:'linear-gradient(145deg,rgba(255,255,255,.78),rgba(185,140,255,.22))',border:'1px solid rgba(110,69,201,.22)',boxShadow:'0 24px 65px rgba(52,40,73,.12),inset 0 1px 0 rgba(255,255,255,.85)',backdropFilter:'blur(8px)',transform:`rotate(${rotate}deg)`,opacity}}/>;

const MetalRail:React.FC<{x:number;y:number;width:number;rotate?:number}>=({x,y,width,rotate=0})=><div style={{position:'absolute',left:x,top:y,width,height:18,borderRadius:9,background:'linear-gradient(180deg,#AAA6A0,#5F5B58)',boxShadow:'0 16px 30px rgba(26,24,32,.16)',transform:`rotate(${rotate}deg)`}}/>;

const CollisionScene:React.FC=()=>{const frame=useCurrentFrame();const travel=ease(frame,6,76);const impact=ease(frame,72,108);const settle=ease(frame,108,160);return <AbsoluteFill><StudioGround/><SceneTag index="01" title="COLLISION / HOOK"/><CeramicCore x={405} y={510} size={360} rotation={-4+impact*7}/><div style={{position:'absolute',left:92+travel*360,top:660-travel*68,transform:`rotate(${-14+travel*12}deg) scale(${.94+impact*.12})`}}><AcrylicTile x={0} y={0} width={250} height={160}/></div><div style={{position:'absolute',left:520,top:690,width:180+impact*270,height:10,borderRadius:6,background:`linear-gradient(90deg,${AD.palette.purple},rgba(110,69,201,0))`,opacity:impact,transform:`rotate(${-7+settle*3}deg)`,transformOrigin:'left center'}}/><div style={{position:'absolute',left:300,top:1035,width:480,height:120,fontSize:54,fontWeight:950,letterSpacing:-2,color:AD.palette.graphite,opacity:settle,transform:`translateY(${(1-settle)*26}px)`}}>INFORMATION HAT GEWICHT.</div></AbsoluteFill>};

const Tray:React.FC<{x:number;y:number;width:number;depth:number}>=({x,y,width,depth})=><div style={{position:'absolute',left:x,top:y,width,height:180,perspective:900}}><div style={{position:'absolute',inset:0,borderRadius:28,background:'linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,.18))',border:'2px solid rgba(26,24,32,.10)',boxShadow:`0 ${22+depth*9}px ${48+depth*14}px rgba(42,35,28,.10)`,transform:`rotateX(64deg) translateZ(${depth*24}px)`}}/></div>;

const MechanismScene:React.FC=()=>{const frame=useCurrentFrame();const feed=ease(frame,8,62);const sort=ease(frame,58,118);const stack=ease(frame,112,168);const tiles=[0,1,2,3].map((i)=>({x:120+i*120+feed*95,y:420+i*58+sort*(i%2===0?150:260),r:-8+i*5}));return <AbsoluteFill><StudioGround/><SceneTag index="02" title="MECHANISM / SORT"/><MetalRail x={120} y={500} width={800} rotate={8}/><Tray x={160} y={760} width={330} depth={1}/><Tray x={590} y={840} width={330} depth={2}/>{tiles.map((tile,i)=><AcrylicTile key={i} x={tile.x+(stack>0?((i%2)*70):0)} y={tile.y-(stack>0?stack*(i*34):0)} width={150} height={102} rotate={tile.r} opacity={.9}/>)}<div style={{position:'absolute',left:260,top:1160,fontSize:64,fontWeight:950,letterSpacing:-2.5,color:AD.palette.graphite,opacity:stack}}>KONTEXT WIRD SORTIERT.</div></AbsoluteFill>};

const Ring:React.FC<{size:number;opacity:number;rotate:number}>=({size,opacity,rotate})=><div style={{position:'absolute',left:540-size/2,top:710-size/2,width:size,height:size,borderRadius:'50%',border:`${Math.max(8,size*.035)}px solid rgba(125,120,113,${.28*opacity})`,boxShadow:'inset 0 0 0 1px rgba(255,255,255,.08)',transform:`rotate(${rotate}deg) scale(${.82+.18*opacity})`,opacity}}/>;

const PayoffScene:React.FC=()=>{const frame=useCurrentFrame();const open=ease(frame,18,90);const output=ease(frame,86,150);return <AbsoluteFill><StudioGround dark/><SceneTag index="03" title="PAYOFF / GATE" dark/>{[0,1,2,3].map((i)=><Ring key={i} size={520-i*88} opacity={open} rotate={(i%2?1:-1)*open*(16+i*7)}/>)}<div style={{position:'absolute',left:150,top:685,width:280,height:42,borderRadius:21,background:'linear-gradient(90deg,rgba(185,140,255,.1),#6E45C9)',transform:`scaleX(${open})`,transformOrigin:'right center',boxShadow:'0 0 24px rgba(110,69,201,.18)'}}/><div style={{position:'absolute',left:560+output*190,top:560-output*34,width:330,height:430,borderRadius:14,background:'linear-gradient(180deg,#FFFFFF,#EDE9E2)',boxShadow:'0 55px 120px rgba(0,0,0,.38)',transform:`rotateY(${-12+output*12}deg) rotateZ(${(1-output)*4}deg)`,opacity:output}}><div style={{position:'absolute',left:54,right:54,top:70,height:8,borderRadius:4,background:AD.palette.purple}}/><div style={{position:'absolute',left:54,right:90,top:118,height:8,borderRadius:4,background:'rgba(26,24,32,.22)'}}/><div style={{position:'absolute',left:54,right:120,top:154,height:8,borderRadius:4,background:'rgba(26,24,32,.16)'}}/></div><div style={{position:'absolute',left:110,top:1110,width:860,textAlign:'center',fontSize:66,fontWeight:950,letterSpacing:-2.7,color:'#F8F4EE',opacity:output}}>EIN KLARER OUTPUT.</div></AbsoluteFill>};

export const PHYSICAL_AI_WORLD_LAB_ID='KI-ArtDirection-PhysicalAIWorld-V1';
export const PHYSICAL_AI_WORLD_LAB_FPS=30;
export const PHYSICAL_AI_WORLD_LAB_DURATION=540;

export const PhysicalAIWorldLab:React.FC=()=> <AbsoluteFill style={{fontFamily:'Inter,Arial,sans-serif'}}>
  <Sequence from={0} durationInFrames={180} layout="none"><CollisionScene/></Sequence>
  <Sequence from={180} durationInFrames={180} layout="none"><MechanismScene/></Sequence>
  <Sequence from={360} durationInFrames={180} layout="none"><PayoffScene/></Sequence>
</AbsoluteFill>;
