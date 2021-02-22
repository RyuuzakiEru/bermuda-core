// SPDX-License-Identifier: MIT

pragma solidity 0.5.17;

library Pairing {
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    struct G1Point {
        uint256 X;
        uint256 Y;
    }

    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint256[2] X;
        uint256[2] Y;
    }

    /*
     * @return The negation of p, i.e. p.plus(p.negate()) should be zero
     */
    function negate(G1Point memory p) internal pure returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        if (p.X == 0 && p.Y == 0) {
            return G1Point(0, 0);
        } else {
            return G1Point(p.X, PRIME_Q - (p.Y % PRIME_Q));
        }
    }

    /*
     * @return r the sum of two points of G1
     */
    function plus(
        G1Point memory p1,
        G1Point memory p2
    ) internal view returns (G1Point memory r) {
        uint256[4] memory input = [
            p1.X, p1.Y,
            p2.X, p2.Y
        ];
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-add-failed");
    }

    /*
     * @return r the product of a point on G1 and a scalar, i.e.
     *         p == p.scalarMul(1) and p.plus(p) == p.scalarMul(2) for all
     *         points p.
     */
    function scalarMul(G1Point memory p, uint256 s) internal view returns (G1Point memory r) {
        uint256[3] memory input = [p.X, p.Y, s];
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-mul-failed");
    }

    /* @return The result of computing the pairing check
     *         e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
     *         For example,
     *         pairing([P1(), P1().negate()], [P2(), P2()]) should return true.
     */
    function pairing(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2,
        G1Point memory c1,
        G2Point memory c2,
        G1Point memory d1,
        G2Point memory d2
    ) internal view returns (bool) {
        uint256[24] memory input = [
            a1.X, a1.Y, a2.X[0], a2.X[1], a2.Y[0], a2.Y[1],
            b1.X, b1.Y, b2.X[0], b2.X[1], b2.Y[0], b2.Y[1],
            c1.X, c1.Y, c2.X[0], c2.X[1], c2.Y[0], c2.Y[1],
            d1.X, d1.Y, d2.X[0], d2.X[1], d2.Y[0], d2.Y[1]
        ];
        uint256[1] memory out;
        bool success;

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, input, mul(24, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }

        require(success, "pairing-opcode-failed");
        return out[0] != 0;
    }
}

contract Verifier {
    uint256 constant SNARK_SCALAR_FIELD = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant PRIME_Q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
    using Pairing for *;

    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[7] IC;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(uint256(6745018050597478621992953652737887789959137469871170262970126921423985262450), uint256(12209967602943593739593924968765005161670708639699992656293220642961836755639));
        vk.beta2 = Pairing.G2Point([uint256(7281893345916220073426646694368123951017963540466409165112490482793609898661), uint256(20679109128567148084197270435055588707703936430011597825384898416275005953784)], [uint256(12890483384541861968802914870694200688840721177421058980147980742663598954893), uint256(4469526021400560711912269017466236997179452638555482716803259713050541704404)]);
        vk.gamma2 = Pairing.G2Point([uint256(6509951762133381973166203273676032731738221619706934377888674134838769911927), uint256(5055148628760479122737776699452810864445424227967043642004571465959138623879)], [uint256(4379940557648360460969357701463730437212130722189826188563103771140486987660), uint256(9371432949536528117675040880104510257214420195686343874622768291455749310052)]);
        vk.delta2 = Pairing.G2Point([uint256(16768046398995933012983842435911578831050271357309476375049125387903428363934), uint256(14246628534532957274522974930769386172403519738685259394137151752173918942901)], [uint256(18843620997951007471500606515862666133866315832761939966297512977658346699285), uint256(8347240519665784653484884444972638520199496064672936398480912527958182551205)]);
        vk.IC[0] = Pairing.G1Point(uint256(13611415762972372045044196370682701343126423416773064193992169239332284297396), uint256(16273756336523142042950155977320315693895092626325486200633384828895196785761));
        vk.IC[1] = Pairing.G1Point(uint256(20790068496056683313969369837100976942027875507568639487367708994569228480885), uint256(6518872761091585479974810122664488895850788259726143307231754178702721011068));
        vk.IC[2] = Pairing.G1Point(uint256(10198363644703171840511872305857123588553553678969268193866077665344556838296), uint256(8368236252455994252710157417562601788019113398542335833345477617249907578762));
        vk.IC[3] = Pairing.G1Point(uint256(16502652287617345149735811430528916373745088024392880711978160480661047488180), uint256(1616876116969074103351732827930804830650972703461372463154790039515812978790));
        vk.IC[4] = Pairing.G1Point(uint256(470091432408224938676204978038746823794331063618808917078400267708878252169), uint256(21025522193707018871875030533548618907580770595011262435264752382533769896897));
        vk.IC[5] = Pairing.G1Point(uint256(15243687556292597828449015876727038073578803496650169083163770393019560288356), uint256(6613183519514039411727124574771391425648274217599183331237525605562391004235));
        vk.IC[6] = Pairing.G1Point(uint256(6824971173686173364574481567714967539736785965291011350130437984265667060308), uint256(6611175206409678488480643897248993996015029583171216466167033287583865916656));

    }

    /*
     * @returns Whether the proof is valid given the hardcoded verifying key
     *          above and the public inputs
     */
    function verifyProof(
        bytes memory proof,
        uint256[6] memory input
    ) public view returns (bool) {
        uint256[8] memory p = abi.decode(proof, (uint256[8]));
        for (uint8 i = 0; i < p.length; i++) {
            // Make sure that each element in the proof is less than the prime q
            require(p[i] < PRIME_Q, "verifier-proof-element-gte-prime-q");
        }
        Pairing.G1Point memory proofA = Pairing.G1Point(p[0], p[1]);
        Pairing.G2Point memory proofB = Pairing.G2Point([p[2], p[3]], [p[4], p[5]]);
        Pairing.G1Point memory proofC = Pairing.G1Point(p[6], p[7]);

        VerifyingKey memory vk = verifyingKey();
        // Compute the linear combination vkX
        Pairing.G1Point memory vkX = vk.IC[0];
        for (uint256 i = 0; i < input.length; i++) {
            // Make sure that every input is less than the snark scalar field
            require(input[i] < SNARK_SCALAR_FIELD, "verifier-input-gte-snark-scalar-field");
            vkX = Pairing.plus(vkX, Pairing.scalarMul(vk.IC[i + 1], input[i]));
        }

        return Pairing.pairing(
            Pairing.negate(proofA),
            proofB,
            vk.alfa1,
            vk.beta2,
            vkX,
            vk.gamma2,
            proofC,
            vk.delta2
        );
    }
}

