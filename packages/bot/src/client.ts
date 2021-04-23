import axios from "axios";

export class CognitiveService {
  constructor(private endpoint: string) {}

  fetch(text: string) {
    const finalEndpoint = this.endpoint + `/cognitive?question=${text}`;

    return axios.get(finalEndpoint).then((response) => response.data);
  }
}
