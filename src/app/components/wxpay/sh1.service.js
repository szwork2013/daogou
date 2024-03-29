'use strict';

angular.module('daogou')
.factory('MD5', function(){
	return function MD5(string) {
	  
	    function RotateLeft(lValue, iShiftBits) {
	        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	    }
	  
	    function AddUnsigned(lX,lY) {
	        var lX4,lY4,lX8,lY8,lResult;
	        lX8 = (lX & 0x80000000);
	        lY8 = (lY & 0x80000000);
	        lX4 = (lX & 0x40000000);
	        lY4 = (lY & 0x40000000);
	        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
	        if (lX4 & lY4) {
	            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
	        }
	        if (lX4 | lY4) {
	            if (lResult & 0x40000000) {
	                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
	            } else {
	                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
	            }
	        } else {
	            return (lResult ^ lX8 ^ lY8);
	        }
	    }
	  
	    function F(x,y,z) { return (x & y) | ((~x) & z); }
	    function G(x,y,z) { return (x & z) | (y & (~z)); }
	    function H(x,y,z) { return (x ^ y ^ z); }
	    function I(x,y,z) { return (y ^ (x | (~z))); }
	  
	    function FF(a,b,c,d,x,s,ac) {
	        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
	        return AddUnsigned(RotateLeft(a, s), b);
	    };
	  
	    function GG(a,b,c,d,x,s,ac) {
	        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
	        return AddUnsigned(RotateLeft(a, s), b);
	    };
	  
	    function HH(a,b,c,d,x,s,ac) {
	        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
	        return AddUnsigned(RotateLeft(a, s), b);
	    };
	  
	    function II(a,b,c,d,x,s,ac) {
	        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
	        return AddUnsigned(RotateLeft(a, s), b);
	    };
	  
	    function ConvertToWordArray(string) {
	        var lWordCount;
	        var lMessageLength = string.length;
	        var lNumberOfWords_temp1=lMessageLength + 8;
	        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
	        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
	        var lWordArray=Array(lNumberOfWords-1);
	        var lBytePosition = 0;
	        var lByteCount = 0;
	        while ( lByteCount < lMessageLength ) {
	            lWordCount = (lByteCount-(lByteCount % 4))/4;
	            lBytePosition = (lByteCount % 4)*8;
	            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
	            lByteCount++;
	        }
	        lWordCount = (lByteCount-(lByteCount % 4))/4;
	        lBytePosition = (lByteCount % 4)*8;
	        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
	        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
	        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
	        return lWordArray;
	    };
	  
	    function WordToHex(lValue) {
	        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
	        for (lCount = 0;lCount<=3;lCount++) {
	            lByte = (lValue>>>(lCount*8)) & 255;
	            WordToHexValue_temp = "0" + lByte.toString(16);
	            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
	        }
	        return WordToHexValue;
	    };
	  
	    function Utf8Encode(string) {
	        string = string.replace(/\r\n/g,"\n");
	        var utftext = "";
	  
	        for (var n = 0; n < string.length; n++) {
	  
	            var c = string.charCodeAt(n);
	  
	            if (c < 128) {
	                utftext += String.fromCharCode(c);
	            }
	            else if((c > 127) && (c < 2048)) {
	                utftext += String.fromCharCode((c >> 6) | 192);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }
	            else {
	                utftext += String.fromCharCode((c >> 12) | 224);
	                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	                utftext += String.fromCharCode((c & 63) | 128);
	            }
	  
	        }
	  
	        return utftext;
	    };
	  
	    var x=Array();
	    var k,AA,BB,CC,DD,a,b,c,d;
	    var S11=7, S12=12, S13=17, S14=22;
	    var S21=5, S22=9 , S23=14, S24=20;
	    var S31=4, S32=11, S33=16, S34=23;
	    var S41=6, S42=10, S43=15, S44=21;
	  
	    string = Utf8Encode(string);
	  
	    x = ConvertToWordArray(string);
	  
	    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	  
	    for (k=0;k<x.length;k+=16) {
	        AA=a; BB=b; CC=c; DD=d;
	        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
	        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
	        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
	        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
	        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
	        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
	        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
	        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
	        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
	        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
	        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
	        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
	        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
	        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
	        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
	        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
	        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
	        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
	        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
	        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
	        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
	        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
	        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
	        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
	        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
	        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
	        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
	        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
	        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
	        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
	        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
	        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
	        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
	        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
	        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
	        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
	        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
	        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
	        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
	        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
	        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
	        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
	        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
	        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
	        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
	        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
	        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
	        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
	        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
	        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
	        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
	        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
	        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
	        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
	        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
	        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
	        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
	        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
	        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
	        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
	        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
	        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
	        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
	        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
	        a=AddUnsigned(a,AA);
	        b=AddUnsigned(b,BB);
	        c=AddUnsigned(c,CC);
	        d=AddUnsigned(d,DD);
	    }
	  
	    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
	  
	    return temp.toLowerCase();
	}
})

.factory('sha1', function() {

	/*
	 *
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 *
	 * By lizq
	 *
	 * 2006-11-11
	 *
	 */
	/*
	 *
	 * Configurable variables.
	 *
	 */
	var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
	var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode */

	return hex_sha1;
	/*
	 *
	 * The main function to calculate message digest
	 *
	 */
	function hex_sha1(s) {

		return binb2hex(core_sha1(AlignSHA1(s)));

	}

	/*
	 *
	 * Perform a simple self-test to see if the VM is working
	 *
	 */
	function sha1_vm_test() {

		return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";

	}

	/*
	 *
	 * Calculate the SHA-1 of an array of big-endian words, and a bit length
	 *
	 */
	function core_sha1(blockArray) {

		var x = blockArray; // append padding
		var w = Array(80);

		var a = 1732584193;

		var b = -271733879;

		var c = -1732584194;

		var d = 271733878;

		var e = -1009589776;

		for (var i = 0; i < x.length; i += 16) // 每次处理512位 16*32
		{

			var olda = a;

			var oldb = b;

			var oldc = c;

			var oldd = d;

			var olde = e;

			for (var j = 0; j < 80; j++) // 对每个512位进行80步操作
			{

				if (j < 16)
					w[j] = x[i + j];

				else
					w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

				var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));

				e = d;

				d = c;

				c = rol(b, 30);

				b = a;

				a = t;

			}

			a = safe_add(a, olda);

			b = safe_add(b, oldb);

			c = safe_add(c, oldc);

			d = safe_add(d, oldd);

			e = safe_add(e, olde);

		}

		return new Array(a, b, c, d, e);

	}

	/*
	 *
	 * Perform the appropriate triplet combination function for the current
	 * iteration
	 *
	 * 返回对应F函数的值
	 *
	 */
	function sha1_ft(t, b, c, d) {

		if (t < 20)
			return (b & c) | ((~b) & d);

		if (t < 40)
			return b ^ c ^ d;

		if (t < 60)
			return (b & c) | (b & d) | (c & d);

		return b ^ c ^ d; // t<80
	}

	/*
	 *
	 * Determine the appropriate additive constant for the current iteration
	 *
	 * 返回对应的Kt值
	 *
	 */
	function sha1_kt(t) {

		return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;

	}

	/*
	 *
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 *
	 * to work around bugs in some JS interpreters.
	 *
	 * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法
	 *
	 */
	function safe_add(x, y) {

		var lsw = (x & 0xFFFF) + (y & 0xFFFF);

		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

		return (msw << 16) | (lsw & 0xFFFF);

	}

	/*
	 *
	 * Bitwise rotate a 32-bit number to the left.
	 *
	 * 32位二进制数循环左移
	 *
	 */
	function rol(num, cnt) {

		return (num << cnt) | (num >>> (32 - cnt));

	}

	/*
	 *
	 * The standard SHA1 needs the input string to fit into a block
	 *
	 * This function align the input string to meet the requirement
	 *
	 */
	function AlignSHA1(str) {

		var nblk = ((str.length + 8) >> 6) + 1,
			blks = new Array(nblk * 16);

		for (var i = 0; i < nblk * 16; i++)
			blks[i] = 0;

		for (i = 0; i < str.length; i++)

			blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);

		blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);

		blks[nblk * 16 - 1] = str.length * 8;

		return blks;

	}

	/*
	 *
	 * Convert an array of big-endian words to a hex string.
	 *
	 */
	function binb2hex(binarray) {

		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";

		var str = "";

		for (var i = 0; i < binarray.length * 4; i++) {

			str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +

				hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);

		}

		return str;

	}

	/*
	 *
	 * calculate MessageDigest accord to source message that inputted
	 *
	 */
	function calcDigest() {

		var digestM = hex_sha1(document.SHAForm.SourceMessage.value);

		document.SHAForm.MessageDigest.value = digestM;

	}

});