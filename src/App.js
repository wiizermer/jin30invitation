import React, { Component } from "react";
import './App.css';
import moment from 'moment'

const identityList = [
  { name: "Angus", nName: "格斯 a.k.a Father of Avery", code: "YOLOFUCKYOU" },
  { name: "Abby", nName: "芊芊 a.k.a Mother of Avery", code: "AVERYSOCUTE" },
  { name: "Andera", nName: "林老濕", code: "ITSALLABOUTSEX" },
  { name: "Davis", nName: "政偉同學", code: "MAJOHNLOSER" },
  { name: "Betty", nName: "貝蒂", code: "GIVEMEYOURFOLLOWERS" },
  { name: "Evan", nName: "郭董", code: "KEBUKE" },
  { name: "Shawn", nName: "大哥 a.k.a 內湖金城武", code: "大哥喝了吧" },
  { name: "Karen", nName: "高高", code: "能不能別再減肥了" },
  { name: "Eddie", nName: "艾迪", code: "年終分我一點拜託" },
  { name: "陳奕廷", code: "湯圓他爸" },
  { name: "Debby", nName: "小芸", code: "湯圓他媽" },
  { name: "Sara", nName: "張郡芳", code: "負債上億勝利組" },
  { name: "William", nName: "威廉", code: "???" },
  { name: "Sunny", nName: "高煦媛", code: "SUNNYKAO" },
  { name: "盧靖", nName: "豬豬", code: "shrekissocute" }
];

class App  extends Component  {
  constructor (props) {
    super(props)
    const dMinus = moment("2020-12-05").diff(moment(), "days");
    const id = localStorage.getItem("id")
    const identity = identityList.find(d => d.name === id)
    const confirmed = localStorage.getItem("confirmed");

    this.state = {
      dDay: dMinus,
      openVerifyInput: false,
      verified: !!id,
      identity,
      confirmed: confirmed === 'true'
    }
    
  }

  varifyIdentity = async (variationcode) => {
    const isMember = identityList.some(d => d.code === variationcode)
    if (isMember) {
      this.setState({
        verified: true,
        notAuthed: false,
        identity: identityList.find(d => d.code === variationcode)
      })
      await window.localStorage.setItem("id", identityList.find(d => d.code === variationcode).name);
    } else {
      this.setState({
        notAuthed: true
      })
    }
  }

  sendOut = (isjoin) => {
    this.setState({ loading: true })
    const { identity, remark } = this.state
    console.log({ Name: identity.name, isJoined: isjoin, remark: remark })
    fetch("https://api.apispreadsheets.com/data/4221/", {
      method: "POST",
      body: JSON.stringify({ data: { Name: identity.name, isJoined: isjoin, remark: remark } })
    }).then(res => {
      if (res.status === 201) {
        this.setState({ confirmed: true, loading: false  })
        window.localStorage.setItem("confirmed", 'true');
      } else {
        this.setState({ badRequest: true, loading: false });
      }
    });
  }

  componentDidMount() {
    this.dDayRefresh = setInterval(() => {
      const dMinus = moment("2020-12-05").diff(moment(), "days");
      this.setState({ dDay: dMinus });
    }, 3600000)
  }

  componentWillUnmount() {
    clearInterval(this.dDayRefresh);
  }
  
  

  render () {

    const { dDay, variationcode, verified, identity, notAuthed, remark, confirmed, loading, badRequest } = this.state;
    return <main>
        <div class="p-4 w-100" style={{ background: "rgb(8, 209, 209)" }}>
          <p
            style={{
              margin: 0,
              fontSize: "4rem",
              fontWeight: 900,
              color: "#fff"
            }}
          >
            三十而靖
          </p>
          <p style={{ margin: 0, fontSize: "5rem", color: "#fff", fontWeight: 900 }}>
            D - {dDay}
          </p>
          <div>
            <lottie-player loop autoplay src="https://assets4.lottiefiles.com/packages/lf20_fwQ7Gu.json" background="transparent" speed="1.2" style={{ width: "200px", height: "200px", margin: "auto" }} />
          </div>
        </div>
        {!verified && <div class="row m-auto w-100">
            <div class="input-group w-100 mb-3 ml-auto p-4" style={{}}>
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  #
                </span>
              </div>
              <input type="text" placeholder="請輸入您的專屬邀請碼" class="form-control" value={variationcode} onChange={e => this.setState(
                    { variationcode: e.target.value }
                  )} />
              <div class="input-group-append">
                <button type="button" class="btn btn-info" onClick={() => this.varifyIdentity(variationcode)}>
                  驗證
                </button>
              </div>
            </div>
          </div>}
        {notAuthed && <p>別亂試喔幹！</p>}
        {verified && !notAuthed && <section class="w-100 p-4" style={{ background: "rgb(8, 209, 209)" }}>
              <text class="m-auto" style={{ textAlign: "left", color: "#fff" }}>
                <h4>
                  親愛的 {identity.name}, {identity.nName} 您好：
                </h4>
                <h1 style={{ color: "#f5d86e", fontSize: 32 }}>恭喜您！</h1>
                <p>
                  歷經重重篩選，您已被確認受邀參加
                  <b style={{ color: "#f5d86e" }}>
                    {" "}
                    盧靖
                  </b> 的三十而已生日歡唱派對，敬請於下方回覆您是否出席。
                </p>
                <p>
                  時間：<b>2020-12-05 晚上 21:00</b>
                </p>
                <p>
                  地點：<b>SOGO 錢櫃</b>
                </p>
                <iframe title="location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d766.9697067420609!2d121.54421535771908!3d25.04152578292411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abd09ec3c6e3%3A0x13e5d3e71eef419d!2z6Yyi5quD5Y-w5YyXU09HT-W6lw!5e0!3m2!1szh-TW!2stw!4v1606666162468!5m2!1szh-TW!2stw" frameborder="0" style={{ width: "100%", height: "50vh", border: 0 }} allowfullscreen="" aria-hidden="false" tabindex="0" />
              </text>
              {!confirmed ? <div>
                  <div style={{ textAlign: "left", color: "#fff" }}>
                    <label for="blessing">真誠的祝福或備註</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="5" value={remark} onChange={e => this.setState(
                          { remark: e.target.value }
                        )} />
                  </div>
                  <div class="row m-0 p-0 mt-3">
                    <button type="button" class="btn btn-light ml-auto" onClick={() => this.sendOut("不參加")}>
                      {loading && <span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />}
                      不克參加
                    </button>
                    <button type="button" class="btn btn-info ml-3" onClick={() => this.sendOut("參加")}>
                      {loading && <span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />}
                      確認參加
                    </button>
                  </div>
                  {badRequest && <p style={{ color: 'red' }}>發生技術性錯誤！請聯絡吉米！</p>}
                </div> : <div style={{ marginTop: 20 }}>
                  <p style={{ color: "#fff", fontSize: 28 }}>感謝您的回覆！!</p>
                  <lottie-player loop autoplay src="https://assets9.lottiefiles.com/private_files/lf30_kcOBaC.json" background="transparent" speed="1.2" style={{ width: "300px", height: "300px", margin: "auto" }} />
                </div>}
            </section>}
      </main>;
  }
}

export default App;
