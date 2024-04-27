const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

// console.log("ethers:", ethers);

describe("RunVerifier", function () {
  it("Should accept the Groth zk-proof of running HealthKit data", async function () {
    const { runVerifier, owner, signer1 } = await loadFixture(
      deployRunningVerifier
    );

    const proof = {
      A: [
        "20922349040915033787686440688005031694685334963811606392194956006318737404428",
        "11798373179038209391188032240468618228410614456942780451170031576704413735462",
        "1",
      ],
      B: [
        "8536269986027070848013715683044173153382585879349761639115985815457001018473",
        "4923320128052831037618108956747868942470151469491178360035075864621629022950",
        "1",
      ],
      C: [
        "13086852576406397872535745809922950362905670611526058669064900205263138752675",
        "4639461238968638666265875248988108044890146914935822644036723867636542155352",
        "1",
      ],
      Z: [
        "4926461131673010713450457094363037420571998007411911662697711086387656274327",
        "3631952910018397507037570944394879772917000133319738937900393682616008768336",
        "1",
      ],
      T1: [
        "5067237285556803383633827040760806180742123784681625135533200325293919350054",
        "15349417223526237335303704489825291213928920926559814603203502966214444906128",
        "1",
      ],
      T2: [
        "2992968484572593360042097471232254055366385933968809059943391702164137449236",
        "14408171928211027590992277669668471821650165308628730558724438396359236134011",
        "1",
      ],
      T3: [
        "5530333945724617946585972846895919390806495379767601899970344576913716443944",
        "18992953820344675759078640348063158514085029400576627776914815765181058938523",
        "1",
      ],
      Wxi: [
        "14436257697267568808685451592306452378403173911332453757446233330525088498611",
        "16976644336348554385379645055016470305099522996505859261336445449329980318874",
        "1",
      ],
      Wxiw: [
        "21278903388280582061733832194966576852770009961415795943435354392523403651063",
        "8550810137767031978669186757080027712628505045153286616136540001517478551680",
        "1",
      ],
      eval_a:
        "3267281429076269011485226554981807813032527086949336617208921919698733020928",
      eval_b:
        "9475395225750869081195322793293616409688820755869641926285866287219132289835",
      eval_c:
        "19129999142759399545254711916559669753325154506519540607501685407262583599033",
      eval_s1:
        "19825831162598896704844175256507853054526242432389820427177024072164630763177",
      eval_s2:
        "9938392479352935060831242640797888048953961915424870851568209668271060372137",
      eval_zw:
        "1228083514574460750547629328891997724632837265796341343598018782942051201443",
      protocol: "plonk",
      curve: "bn128",
    };
    const pubSignals = ["1606812600", "1606825200", "6", "10"];

    const proofArrObj = reorderDict(proof);
    const tempProof = convertProofToHex(proofArrObj)
    const formattedProof = convertObjectToHexPadded(tempProof);
    const pubSignalHex = convertToHexPadded(pubSignals);

    // Call the verifyProof function
    const result = await runVerifier.verifyProof(
      formattedProof,
      pubSignalHex
    );
    console.log("Verification result:", result);
    console.log(formattedProof.length);
    expect(result).to.be.true;
  });

  it("Should reject the Groth zk-proof of running HealthKit data", async function () {
    const { runVerifier, owner, signer1 } = await loadFixture(
      deployRunningVerifier
    );

    const proof = {
      A: [
        "20922349040915033787686440688005031694685334963811606392194956006318737404428",
        "11798373179038209391188032240468618228410614456942780451170031576704413735462",
        "1",
      ],
      B: [
        "8536269986027070848013715683044173153382585879349761639115985815457001018473",
        "4923320128052831037618108956747868942470151469491178360035075864621629022950",
        "1",
      ],
      C: [
        "13086852576406397872535745809922950362905670611526058669064900205263138752675",
        "4639461238968638666265875248988108044890146914935822644036723867636542155352",
        "1",
      ],
      Z: [
        "4926461131673010713450457094363037420571998007411911662697711086387656274327",
        "3631952910018397507037570944394879772917000133319738937900393682616008768336",
        "1",
      ],
      T1: [
        "5067237285556803383633827040760806180742123784681625135533200325293919350054",
        "15349417223526237335303704489825291213928920926559814603203502966214444906128",
        "1",
      ],
      T2: [
        "2992968484572593360042097471232254055366385933968809059943391702164137449236",
        "14408171928211027590992277669668471821650165308628730558724438396359236134011",
        "1",
      ],
      T3: [
        "5530333945724617946585972846895919390806495379767601899970344576913716443944",
        "18992953820344675759078640348063158514085029400576627776914815765181058938523",
        "1",
      ],
      Wxi: [
        "14436257697267568808685451592306452378403173911332453757446233330525088498611",
        "16976644336348554385379645055016470305099522996505859261336445449329980318874",
        "1",
      ],
      Wxiw: [
        "21278903388280582061733832194966576852770009961415795943435354392523403651063",
        "8550810137767031978669186757080027712628505045153286616136540001517478551680",
        "1",
      ],
      eval_a:
        "3267281429076269011485226554981807813032527086949336617208921919698733020927",
      eval_b:
        "9475395225750869081195322793293616409688820755869641926285866287219132289835",
      eval_c:
        "19129999142759399545254711916559669753325154506519540607501685407262583599033",
      eval_s1:
        "19825831162598896704844175256507853054526242432389820427177024072164630763177",
      eval_s2:
        "9938392479352935060831242640797888048953961915424870851568209668271060372137",
      eval_zw:
        "1228083514574460750547629328891997724632837265796341343598018782942051201443",
      protocol: "plonk",
      curve: "bn128",
    };
    const pubSignals = ["1606812600", "1606825200", "6", "10"];

    const proofArrObj = reorderDict(proof);
    const tempProof = convertProofToHex(proofArrObj)
    const formattedProof = convertObjectToHexPadded(tempProof);
    const pubSignalHex = convertToHexPadded(pubSignals);

    // Call the verifyProof function
    const result = await runVerifier.verifyProof(
      formattedProof,
      pubSignalHex
    );
    console.log("Verification result:", result);
    expect(result).to.be.false;
  });
});

describe("SleepVerifier", function () {
  it("Should accept the Groth zk-proof of sleep HealthKit data", async function () {
    const { sleepVerifier, owner, signer1 } = await loadFixture(
      deploySleepingVerifier
    );

    const proof = {
      "A": [
       "15403374124330802614667720745980614998323625951327939146217480464772040164486",
       "2718349697279901868363481231063651539694934917990921750765789982175364689720",
       "1"
      ],
      "B": [
       "7429084043130387582237167854395482236241497511663117560915002823175698045270",
       "16945035650657151273933537154295010176581035241300342310455088282746839821042",
       "1"
      ],
      "C": [
       "18366474143331642896959952777877191895512662927375189148346253212965553058614",
       "5175079293731162602534785065116651029930718618418480459138980849203693521098",
       "1"
      ],
      "Z": [
       "8195157247920360411704078283163418160038538613547456830763481307753735671709",
       "2272222834870247005668344922150475901994679190531678635110450874614919563208",
       "1"
      ],
      "T1": [
       "8362752559923091147001152941930987425724737410369214829044521033255043839468",
       "16087965491365932786576829854172456320184878402635151469888857207395325410072",
       "1"
      ],
      "T2": [
       "3029570616875644511829356224923737219010017027806523028723863587179866721180",
       "16909993277198934885103459398266484071307384359413961028982130578524367149196",
       "1"
      ],
      "T3": [
       "18930532524676344185711989708989066642312938809089577774381499941372105536703",
       "4912145082527024093611440823291565155011632935565351469447055337688765774386",
       "1"
      ],
      "Wxi": [
       "3054887161675109287491400768540868868480868867918239243538692581322387435908",
       "6251572415285636570516612527154409509019014041334603359907768219324199110133",
       "1"
      ],
      "Wxiw": [
       "15943209889503710871447619239071389596085107762088078164096688207088170100398",
       "8061895891773380014518204371738186176347435731108981752402950128604341466232",
       "1"
      ],
      "eval_a": "15299324421815781695400855707736703291119820287021860547074298788322356307005",
      "eval_b": "16080837631211903345219768668718371005457279215633296682168766813099579409921",
      "eval_c": "11717876986291049045568285118087640916598692027288545115747608392705647363706",
      "eval_s1": "21473930146888787058302570466179965000425548808129088638985793564703327303314",
      "eval_s2": "8800664474535295483523728300474564665852121888582916514046528283476419770426",
      "eval_zw": "17761477370241083776653134532758721125249222477196975426468977601145156192",
      "protocol": "plonk",
      "curve": "bn128"
     };
    const pubSignals = [
      "1606812600",
      "1606825200",
      "6",
      "8"
     ];

    // const formattedProof = convertObjectToHexPadded(convertProofToObjectHex(proof));
    const proofArrObj = reorderDict(proof);
    const tempProof = convertProofToHex(proofArrObj)
    const formattedProof = convertObjectToHexPadded(tempProof);
    const pubSignalHex = convertToHexPadded(pubSignals);

    // Call the verifyProof function
    const result = await sleepVerifier.verifyProof(
      formattedProof,
      pubSignalHex
    );
    console.log("Verification result:", result);
    expect(result).to.be.true;
  });

  it("Should reject the Groth zk-proof of sleep HealthKit data", async function () {
    const { sleepVerifier, owner, signer1 } = await loadFixture(
      deploySleepingVerifier
    );

    const proof = {
      "A": [
          "17367512862327205831157207056034360466061213282878652385443035952944745113635",
          "15391602922332794399815271705146214787096148372913078190254176250475576145937",
          "1"
      ],
      "B": [
          "3652921391423956450800618064789768992043280304251422712084325857894035822886",
          "12249095325095842852987488691771863299296855247072172974350233334628301467228",
          "1"
      ],
      "C": [
          "9933973313491754320332828018749684659093085559309218790550600531796607404899",
          "7717830251898138467368170274174712220060476579098567849297317587898481665964",
          "1"
      ],
      "Z": [
          "13194233725399113634535488861365913956344660206270367245763339580790478834380",
          "17452917327304777100100407872263657211574360973740628619122946709924460566767",
          "1"
      ],
      "T1": [
          "13221232108322996814087744912255458606667443390499591499019238029562645187275",
          "5287515464911324181350130143849305385829950996132951853941785783000080136348",
          "1"
      ],
      "T2": [
          "21608358226766324417578894138722023519391773671557242103030209772513403342047",
          "7878240881236719365190434567670379931660255260719944860794877541232077881796",
          "1"
      ],
      "T3": [
          "21763864359318667633132919386022518759396840679561776449249989787856564249719",
          "10200648498552731813148484467708313994572228853111329144622832925230913101664",
          "1"
      ],
      "eval_a": "18254320816899630114274117994089095014774685780587016203298876854545483633196",
      "eval_b": "16876083344235517887195991660947637303135667381282976745338877523403161477835",
      "eval_c": "20917765161012328833764673240105364543654074289301204635450717221561264574285",
      "eval_s1": "21227366120144223578632765785034957308344377250831485000079270404114882603795",
      "eval_s2": "3626578689482442988236548443476192689567268478129878948721946437385758419804",
      "eval_zw": "5216846482185186207916038520019291548989932729208198670492400919003741565706",
      "eval_r": "12750467461808367277172356200448001879552501719919723200245241089667078558701",
      "Wxi": [
          "20965387333278712664321701606872077751240208910079673544867907969791874246898",
          "9498540605622530779440517850255947098973804445557432370009791162504499863199",
          "1"
      ],
      "Wxiw": [
          "17081454467096880489994582103480480989451609398642070091255346401827897106753",
          "3279046200363872515235385324866190818521724181482302136744301026517477972519",
          "1"
      ],
      "protocol": "plonk",
      "curve": "bn128"
  };
    const pubSignals = ["1606812600", "1606825200", "6", "11"];

    const proofArrObj = reorderDict(proof);
    const tempProof = convertProofToHex(proofArrObj)
    const formattedProof = convertObjectToHexPadded(tempProof);
    const pubSignalHex = convertToHexPadded(pubSignals);

    // Call the verifyProof function
    const result = await sleepVerifier.verifyProof(
      formattedProof,
      pubSignalHex
    );
    console.log("Verification result:", result);
    expect(result).to.be.false;
  });
});

function convertObjectToHexPadded(obj) {
  const hexArray = [];

  // Function to convert a single BigInt number to a padded hex string
  const toPaddedHexString = (bigInt) => {
    return "0x" + bigInt.toString(16).padStart(64, "0");
  };

  // Iterate over each key in the object
  for (const key of Object.keys(obj)) {
    const value = obj[key];

    // Check if the value is an array (handle nested arrays too)
    if (Array.isArray(value)) {
      // Handle nested arrays for points like A, B, C, etc.
      if (Array.isArray(value[0])) {
        value.forEach((innerArray) => {
          innerArray.forEach((number) => {
            hexArray.push(toPaddedHexString(BigInt(number)));
          });
        });
      } else {
        // Handle flat arrays for points like eval_a, eval_b, etc.
        value.forEach((number) => {
          hexArray.push(toPaddedHexString(BigInt(number)));
        });
      }
    } else {
      // Handle single values that are not arrays
      hexArray.push(toPaddedHexString(BigInt(value)));
    }
  }

  return hexArray;
}

function convertProofToHex(proof) {
  // Helper function to convert to a 0x-prefixed hexadecimal string
  const toHex = (numStr) => {
    return "0x" + BigInt(numStr).toString(16);
  };

  // Convert the proof object, excluding the "1"s and non-numeric properties
  let convertedProof = {};
  for (let [key, value] of Object.entries(proof)) {
    if (key !== "protocol" && key !== "curve") {
      if (key.startsWith("eval_")) {
        // Convert single numeric strings directly
        convertedProof[key] = toHex(value);
      } else {
        // Convert arrays, excluding the last element "1"
        convertedProof[key] = value.slice(0, -1).map(toHex);
      }
    }
  }

  return convertedProof;
}

function reorderDict(dict) {
  dictReorder = [
    { key: "A", value: dict["A"] },
    { key: "B", value: dict["B"] },
    { key: "C", value: dict["C"] },
    { key: "Z", value: dict["Z"] },
    { key: "T1", value: dict["T1"] },
    { key: "T2", value: dict["T2"] },
    { key: "T3", value: dict["T3"] },
    { key: "Wxi", value: dict["Wxi"] },
    { key: "Wxiw", value: dict["Wxiw"] },
    { key: "eval_a", value: dict["eval_a"] },
    { key: "eval_b", value: dict["eval_b"] },
    { key: "eval_c", value: dict["eval_c"] },
    { key: "eval_s1", value: dict["eval_s1"] },
    { key: "eval_s2", value: dict["eval_s2"] },
    { key: "eval_zw", value: dict["eval_zw"] },
  ];
  result = {}
  for (let item of dictReorder) {
    result[item.key] = item.value;
  }

  return result;
}

function convertToHexPadded(pubSignals) {
  return pubSignals.map((signal) => {
    // Convert the decimal string to a BigInt
    const bigIntValue = BigInt(signal);

    // Convert BigInt to a hexadecimal string
    let hexValue = bigIntValue.toString(16);

    // Pad the hexadecimal string with leading zeros to ensure 64 characters
    // 64 characters correspond to 32 bytes or 256 bits, which is typical for Ethereum
    const paddedHex = "0x" + hexValue.padStart(64, "0");

    return paddedHex;
  });
}

async function deployRunningVerifier() {
  const [owner, signer1] = await ethers.getSigners();

  // Link the Pairing library to the RunVerifier contract
  const RunVerifier = await ethers.getContractFactory("RunPlonkVerifier", {});

  // Deploy the RunVerifier with the linked Pairing library
  const runVerifier = await RunVerifier.deploy();

  return { runVerifier, owner, signer1 };
}

async function deploySleepingVerifier() {
  const [owner, signer1] = await ethers.getSigners();

  // Link the Pairing library to the RunVerifier contract
  const SleepVerifier = await ethers.getContractFactory(
    "SleepPlonkVerifier",
    {}
  );

  // Deploy the RunVerifier with the linked Pairing library
  const sleepVerifier = await SleepVerifier.deploy();

  return { sleepVerifier, owner, signer1 };
}
