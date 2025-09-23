// export message type
export type Message = {
  message?: string;
  status?: string;
}

// export decrypt function
export function properCase(text: string): string {
  const result = text.replace(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });

  return result.charAt(0).toUpperCase() + result.substring(1);
}

// export generate random id
export function randomId(length = 5) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// export generate random key
export function randomKey() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const result = [];

  // Ensure at least 3 numbers
  for (let i = 0; i < 3; i++) {
    result.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }

  // Fill the remaining characters with letters
  while (result.length < 7) {
    result.push(letters[Math.floor(Math.random() * letters.length)]);
  }

  // Shuffle the result array to mix numbers and letters
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  // return result
  return result.join('');
}

// export is valid email
export function isValidEmail(email: string) {
  // check if valid email
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

// export debounce function
export function debounce(fn: (...args: any) => void, delay: number) {
  // let timer
  let timer: any;

  // set function
  return function (...args: any) {
    // clear timer
    clearTimeout(timer);

    // set timer
    timer = setTimeout(() => {
      // call the function
      fn(...args);
    }, delay);
  };
}

// export throttle function
export function throttle(fn: (...args: any) => void, delay: number) {
  // let should wait
  let shouldWait = false;

  // set function
  return function (...args: any) {
    // return on should wait
    if (shouldWait) return;

    // call the function
    fn(...args);

    // set should wait
    shouldWait = true;

    // set timer
    setTimeout(() => {
      // set should wait
      shouldWait = false;
    }, delay);
  };
}

export function render(template: string, data: any): string {
  // reform data
  data = data || {};

  // check template error
  const checkError = (template: string, keys: any, vals: any): string => {
    // get undefined var
    const undefinedVar = new Function(...keys,
      `try {
        return \`${template}\`;
      } catch (e) {
        // get undefined variable name
        let key = e.message.replace(" is not defined", "");

        // console error
        if(e.message.substring(0, 20).toLowerCase() == "cannot read property") {
          console.error("Render Error : " + e.message);
          console.error("");
        }

        // return key and val
        return {key: key, val: ""};
      }`
    )(...vals);

    // if undefined found
    if (typeof undefinedVar == "object") {
      // set assign key
      keys.push(undefinedVar.key);

      // set assign val
      vals.push(undefinedVar.val);

      // render template with vars
      return checkError(template, keys, vals);
    } else {
      // render template with vars
      return undefinedVar;
    }
  }

  // get rendered template
  const interpolate = (template: string, params: any) => {
    // reform params
    params = params || {};

    // get variable keys
    const keys = Object.keys(params);

    // get variable vals
    const vals = Object.values(params);

    // return rendered template
    return checkError(template, keys, vals);
  }

  // return rendered template
  return interpolate(template, data);
}

// set colors
export const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-lime-500', 'bg-teal-500', 'bg-cyan-500', 'bg-rose-500'];

// get innitials
export function getInnitails(fullname: string) {
  // get user name avatar
  const name = fullname.trim().split(" ");

  // let avatar
  const avatar = [];

  // set avatar short name
  if (name.length > 1) {
    // get first name
    avatar.push(name[0].charAt(0).toUpperCase());

    // get last name
    avatar.push(name[name.length - 1].charAt(0).toUpperCase());
  } else {
    // get name
    avatar.push(name[0].charAt(0).toUpperCase());
  }

  // set user avatar initial
  return avatar.join("");
}